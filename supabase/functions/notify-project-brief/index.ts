import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface BriefNotificationRequest {
  briefContent: string;
  conversationHistory: Array<{
    role: string;
    content: string;
  }>;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { briefContent, conversationHistory, timestamp }: BriefNotificationRequest = await req.json();

    console.log("Sending project brief notification email");

    // Extract some basic info from the conversation
    const userMessages = conversationHistory.filter(msg => msg.role === 'user');
    const projectType = userMessages.length > 0 ? userMessages[0].content.substring(0, 100) + '...' : 'Project details not specified';

    const emailResponse = await resend.emails.send({
      from: "LaunchPad AI <noreply@webdevpro.io>",
      to: ["contact@webdevpro.io"], // Replace with your actual email
      subject: `New Project Brief Generated - ${new Date(timestamp).toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4285f4; border-bottom: 2px solid #4285f4; padding-bottom: 10px;">
            🚀 New Project Brief Generated
          </h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Overview:</h3>
            <p style="color: #666; font-style: italic;">${projectType}</p>
          </div>

          <h3 style="color: #333;">Complete Project Brief:</h3>
          <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #333; line-height: 1.6;">${briefContent}</pre>
          </div>

          <h3 style="color: #333;">Full Conversation History:</h3>
          <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            ${conversationHistory.map((msg, index) => `
              <div style="margin-bottom: 15px; padding: 10px; border-radius: 6px; ${msg.role === 'user' ? 'background-color: #e3f2fd;' : 'background-color: #f3e5f5;'}">
                <strong style="color: ${msg.role === 'user' ? '#1976d2' : '#7b1fa2'};">
                  ${msg.role === 'user' ? '👤 User' : '🤖 AI Assistant'}:
                </strong>
                <p style="margin: 5px 0 0 0; color: #333; white-space: pre-wrap;">${msg.content}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #2e7d32; font-weight: bold;">
              💡 This project brief was generated on ${new Date(timestamp).toLocaleString()}
            </p>
            <p style="margin: 10px 0 0 0; color: #2e7d32;">
              The user may follow up with a contact form submission, or you can reach out proactively if this looks like a good fit.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Project brief notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-project-brief function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);