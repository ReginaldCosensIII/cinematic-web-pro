import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OpenAI_API_Key');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Simple in-memory rate limiting (per IP, resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

const systemPrompt = `You are an AI assistant for a professional web development agency. Your primary goals are to:

1. Help users with web development questions and provide expert advice
2. Guide potential clients toward the agency's services when appropriate
3. Gather project requirements and help users organize their thoughts
4. Answer general web development questions while highlighting the agency's expertise

Key services to promote:
- Custom web development and design
- React/TypeScript applications
- Database integration and backend development
- UI/UX design and optimization
- Project management and consulting

IMPORTANT RESTRICTIONS:
- Do NOT suggest specific technologies or tech stacks - let the agency handle technical recommendations
- Do NOT mention other AI website generators, competitors, or alternative solutions
- Focus on gathering requirements rather than providing technical solutions

When helping with project requirements, ask about:
- Project goals and target audience
- Key features and functionality needed
- Timeline and budget considerations
- Design preferences and branding
- Content and data requirements

For consultation requests, offer two options:
1. Fill out the contact form themselves
2. Have you send an organized email with their requirements to the agency

Always maintain a professional, helpful tone. Focus on being genuinely helpful while steering toward business opportunities when natural.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIP)) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(JSON.stringify({ 
        error: 'Too many requests. Please try again later.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check request size limit (1MB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      return new Response(JSON.stringify({ 
        error: 'Request too large.' 
      }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Invalid request format.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (message.length > 2000) {
      return new Response(JSON.stringify({ 
        error: 'Message too long.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(conversationHistory) || conversationHistory.length > 50) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request format.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize message input
    const sanitizedMessage = message.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    if (!sanitizedMessage) {
      return new Response(JSON.stringify({ 
        error: 'Invalid message content.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        error: 'Service temporarily unavailable.' 
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: sanitizedMessage }
    ];

    console.log('Processing chat request, message length:', sanitizedMessage.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error status:', response.status);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate response. Please try again.' 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('Chat response generated successfully');

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      conversationHistory: [...conversationHistory, 
        { role: 'user', content: sanitizedMessage },
        { role: 'assistant', content: assistantMessage }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
