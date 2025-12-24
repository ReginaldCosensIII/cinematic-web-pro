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
const RATE_LIMIT_MAX = 30; // Max requests per window
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

const systemPrompt = `You are a helpful, friendly assistant for WebDevPro.io that helps users brainstorm and compile professional project briefs for custom website builds. Your job is to guide the user through a conversation that results in a clean, well-structured project brief.

Please ask questions one at a time, and guide the user through these key areas:

1. PROJECT OVERVIEW
   - What type of website/application are they building?
   - What is the main purpose or goal?
   - Who is their target audience?

2. FEATURES & FUNCTIONALITY
   - What specific features do they need?
   - Any integrations with third-party services?
   - Do they need user accounts, payments, etc.?

3. DESIGN & BRANDING
   - Do they have existing branding/style preferences?
   - Any reference websites they like?
   - Color schemes, typography preferences?

4. TECHNICAL REQUIREMENTS
   - Do they need mobile responsiveness?
   - Any specific performance requirements?
   - Accessibility needs?

5. TIMELINE & BUDGET
   - When do they need this completed?
   - What's their budget range?
   - Any specific deadlines or milestones?

6. CONTENT & ASSETS
   - Will they provide content and images?
   - Do they need copywriting help?
   - Any existing assets to work with?

Keep the conversation natural and flowing. Ask follow-up questions when needed. When you have enough information, offer to generate a comprehensive project brief summarizing everything discussed.

Be encouraging and professional. If they seem uncertain about something, provide helpful suggestions or examples to guide them.`;

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

    if (message.length > 3000) {
      return new Response(JSON.stringify({ 
        error: 'Message too long.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(conversationHistory) || conversationHistory.length > 100) {
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

    console.log('Processing project brief request, message length:', sanitizedMessage.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 800,
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

    console.log('Project brief response generated successfully');

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
    console.error('Error in project-brief-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
