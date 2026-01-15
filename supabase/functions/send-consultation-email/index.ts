import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .substring(0, maxLength);
}

interface ConsultationEmailRequest {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  requirements: string;
  timeline?: string;
  additionalInfo?: string;
  honeypot?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check request size
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 100 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Request too large' }),
        { status: 413, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const requestData: ConsultationEmailRequest = await req.json();

    // Honeypot check for bot detection
    if (requestData.honeypot) {
      console.log('Bot detected via honeypot field');
      // Return success to not alert bots, but don't process
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const {
      name,
      email,
      company,
      projectType,
      budget,
      requirements,
      timeline,
      additionalInfo
    } = requestData;

    // Validate required fields
    if (!name || !email || !requirements) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, and requirements are required' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name, 100);
    const sanitizedEmail = email.trim().substring(0, 255);
    const sanitizedCompany = company ? sanitizeInput(company, 100) : undefined;
    const sanitizedProjectType = projectType ? sanitizeInput(projectType, 100) : undefined;
    const sanitizedBudget = budget ? sanitizeInput(budget, 50) : undefined;
    const sanitizedRequirements = sanitizeInput(requirements, 5000);
    const sanitizedTimeline = timeline ? sanitizeInput(timeline, 100) : undefined;
    const sanitizedAdditionalInfo = additionalInfo ? sanitizeInput(additionalInfo, 2000) : undefined;

    console.log('Sending consultation email for:', sanitizedName);

    // Email to the agency
    const agencyEmailResponse = await resend.emails.send({
      from: "WebDevPro AI Assistant <onboarding@resend.dev>",
      to: ["hello@webdevpro.io"],
      subject: `New Consultation Request from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 10px;">
            New Consultation Request
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            ${sanitizedCompany ? `<p><strong>Company:</strong> ${sanitizedCompany}</p>` : ''}
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details</h3>
            ${sanitizedProjectType ? `<p><strong>Project Type:</strong> ${sanitizedProjectType}</p>` : ''}
            ${sanitizedBudget ? `<p><strong>Budget:</strong> ${sanitizedBudget}</p>` : ''}
            ${sanitizedTimeline ? `<p><strong>Timeline:</strong> ${sanitizedTimeline}</p>` : ''}
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Requirements</h3>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #4285f4;">
              ${sanitizedRequirements}
            </div>
          </div>

          ${sanitizedAdditionalInfo ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Additional Information</h3>
              <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">
                ${sanitizedAdditionalInfo}
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
      to: [sanitizedEmail],
      subject: "Consultation Request Received - We'll Be In Touch Soon!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 10px;">
            Thank you for your consultation request!
          </h2>
          
          <p>Hi ${sanitizedName},</p>
          
          <p>We've received your consultation request and our AI assistant has organized your project requirements for our team. Here's a summary of what we received:</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Project Requirements</h3>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">
              ${sanitizedRequirements}
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
      JSON.stringify({ error: 'An error occurred processing your request' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
