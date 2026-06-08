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
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

const systemPrompt = `You are the AI assistant for WebDevPro.io — a professional web development & AI solutions agency led by Reggie Cosens. Your job is to help visitors understand the agency's services, answer web/AI questions at a high level, and capture qualified leads.

## Services Offered

**1. Web Development (/services/web-development)**
- Custom Website Design — bespoke, conversion-focused sites
- Full-Stack Development — React/TypeScript front-ends with robust backends, databases, and APIs
- SEO, AEO & AI Discoverability — traditional SEO plus Answer Engine Optimization so the site is discoverable, crawlable, and citable by LLMs, AI agents, and modern search
- Redesign & Revamp — modernize outdated sites
- Additional services: E-commerce builds, API integrations, database design, cloud hosting / DevOps, transactional email, CMS workflows, analytics, ongoing maintenance
- Modern stack: React, TypeScript, Tailwind, Node, ASP.NET, Azure, Supabase, and more

**2. AI Solutions (/services/ai-solutions)**
- Custom AI chatbots & assistants for business websites
- AI-powered automations and workflow integrations
- LLM/agent-friendly site architecture (llms.txt, structured data, semantic HTML)
- Local AI Solutions pages for specific localities (locality-based SEO)

**3. AI LaunchPad — Project Brief Generator (/project-brief)**
- A free AI-guided tool that helps visitors turn a rough idea into a structured project brief
- Brief is auto-emailed to Reggie so he can follow up

**4. Featured Work & Portfolio (/portfolio)**
- Showcase of CES IT and personal projects

## How to handle conversations

- Be warm, concise, professional. Vary sentence length. No long walls of text.
- Recommend the most relevant service/page based on what the visitor describes.
- Do NOT recommend competitors, other agencies, or other AI website generators.
- Do NOT prescribe a specific tech stack — that's Reggie's call after discovery.
- When a visitor asks "how do I get started" or describes a project, offer the AI LaunchPad (/project-brief) for a structured brief, OR offer to send their info directly to Reggie via this chat.

## Capturing leads via this chat (IMPORTANT)

If a visitor wants to be contacted, get a quote, hire the agency, or "have someone reach out", you can submit a contact request on their behalf using the \`submit_contact_request\` tool.

Required before calling the tool:
- name (full name)
- email (valid email)
- message (at least 10 characters — summarize what they need)

Optional but ask for when natural: company, projectType (e.g. "Web Development", "AI Solutions", "Redesign"), budget, phone.

Flow:
1. Confirm they want you to send their info to Reggie.
2. Collect the required fields conversationally (don't dump a giant form).
3. Read the details back in one short summary and ask for confirmation.
4. On confirmation, call \`submit_contact_request\`.
5. After the tool returns success, tell them Reggie will be in touch by email shortly. If it fails, apologize and suggest the /contact page or the AI LaunchPad as a backup.

Never invent contact info. If the visitor refuses to share details, point them to /contact or /project-brief.`;

const tools = [
  {
    type: "function",
    function: {
      name: "submit_contact_request",
      description: "Submit a contact request to the WebDevPro.io team on behalf of the visitor. Only call after the visitor has confirmed they want their info sent and you have name, email, and a clear message.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Visitor's full name" },
          email: { type: "string", description: "Visitor's email address" },
          message: { type: "string", description: "Summary of what the visitor needs (min 10 chars)" },
          company: { type: "string", description: "Company name (optional)" },
          projectType: { type: "string", description: "Type of project, e.g. Web Development, AI Solutions, Redesign (optional)" },
          budget: { type: "string", description: "Budget range (optional)" },
          phone: { type: "string", description: "Phone number (optional)" },
        },
        required: ["name", "email", "message"],
        additionalProperties: false,
      },
    },
  },
];

async function submitContactRequest(args: Record<string, unknown>, originIp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) return { success: false, error: 'Server misconfigured' };
    const res = await fetch(`${supabaseUrl}/functions/v1/submit-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': originIp,
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY') ?? ''}`,
      },
      body: JSON.stringify(args),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.error || `HTTP ${res.status}` };
    }
    return { success: true };
  } catch (err) {
    console.error('submitContactRequest failed:', err);
    return { success: false, error: 'Network error' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';

    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Request too large.' }), {
        status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string' || message.length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid message.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!Array.isArray(conversationHistory) || conversationHistory.length > 50) {
      return new Response(JSON.stringify({ error: 'Invalid history.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sanitized = message.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    if (!sanitized) {
      return new Response(JSON.stringify({ error: 'Invalid message content.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build messages
    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: sanitized },
    ];

    // Tool-calling loop (up to 3 iterations)
    let finalContent = '';
    for (let i = 0; i < 3; i++) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          tools,
          tool_choice: 'auto',
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI error:', response.status, await response.text());
        return new Response(JSON.stringify({ error: 'Failed to generate response. Please try again.' }), {
          status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) break;

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        messages.push(msg);
        for (const call of msg.tool_calls) {
          if (call.function?.name === 'submit_contact_request') {
            let args: Record<string, unknown> = {};
            try { args = JSON.parse(call.function.arguments || '{}'); } catch { /* ignore */ }
            const result = await submitContactRequest(args, clientIP);
            messages.push({
              role: 'tool',
              tool_call_id: call.id,
              content: JSON.stringify(result),
            });
          } else {
            messages.push({
              role: 'tool',
              tool_call_id: call.id,
              content: JSON.stringify({ error: 'Unknown tool' }),
            });
          }
        }
        continue; // ask model to follow up
      }

      finalContent = msg.content || '';
      break;
    }

    if (!finalContent) {
      finalContent = "I'm sorry — I wasn't able to generate a response. Could you rephrase?";
    }

    return new Response(JSON.stringify({
      message: finalContent,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: sanitized },
        { role: 'assistant', content: finalContent },
      ],
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
