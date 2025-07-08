import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OpenAI_API_Key');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { message, conversationHistory = [] } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI for project brief:', message);

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
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('Project brief AI response received successfully');

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      conversationHistory: [...conversationHistory, 
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in project-brief-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});