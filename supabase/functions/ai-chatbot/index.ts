import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OpenAI_API_Key');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Sending request to OpenAI with message:', message);

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
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('OpenAI response received successfully');

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
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});