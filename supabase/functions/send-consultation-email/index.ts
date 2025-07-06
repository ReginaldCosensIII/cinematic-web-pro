import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationEmailRequest {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  requirements: string;
  timeline?: string;
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      company,
      projectType,
      budget,
      requirements,
      timeline,
      additionalInfo
    }: ConsultationEmailRequest = await req.json();

    console.log('Sending consultation email for:', name);

    // Email to the agency
    const agencyEmailResponse = await resend.emails.send({
      from: "AI Assistant <onboarding@resend.dev>",
      to: ["your-email@domain.com"], // Replace with your actual email
      subject: `New Consultation Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 10px;">
            New Consultation Request
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details</h3>
            ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
            ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
            ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Requirements</h3>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #4285f4;">
              ${requirements}
            </div>
          </div>

          ${additionalInfo ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Additional Information</h3>
              <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">
                ${additionalInfo}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>Note:</strong> This consultation request was gathered and organized by our AI assistant 
              based on the client's conversation. Please follow up directly with the client for any clarifications.
            </p>
          </div>
        </div>
      `,
    });

    // Confirmation email to the client
    const clientEmailResponse = await resend.emails.send({
      from: "Web Development Agency <onboarding@resend.dev>",
      to: [email],
      subject: "Consultation Request Received - We'll Be In Touch Soon!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 10px;">
            Thank you for your consultation request!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your consultation request and our AI assistant has organized your project requirements for our team. Here's a summary of what we received:</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Project Requirements</h3>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">
              ${requirements}
            </div>
          </div>

          <p>Our team will review your requirements and reach out to you within 24-48 hours to schedule a consultation call where we can:</p>
          
          <ul>
            <li>Discuss your project in detail</li>
            <li>Provide technical recommendations</li>
            <li>Create a custom proposal for your needs</li>
            <li>Answer any questions you may have</li>
          </ul>

          <p>In the meantime, feel free to reply to this email if you have any additional questions or information to share.</p>

          <p>Best regards,<br>
          The Web Development Team</p>

          <div style="margin-top: 30px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32; font-size: 14px;">
              <strong>💡 Tip:</strong> Our AI assistant helped organize your requirements, but we'd love to hear more 
              about your ideas during our consultation call!
            </p>
          </div>
        </div>
      `,
    });

    console.log("Consultation emails sent successfully");

    return new Response(JSON.stringify({ 
      success: true,
      agencyEmailId: agencyEmailResponse.data?.id,
      clientEmailId: clientEmailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-consultation-email function:", error);
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