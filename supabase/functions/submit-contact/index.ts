
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
  userId?: string;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { name, email, company, projectType, budget, message, userId }: ContactFormData = await req.json();

    // Insert contact submission into database
    const { data, error } = await supabaseClient
      .from('contact_submissions')
      .insert({
        name,
        email,
        company,
        project_type: projectType,
        budget,
        message,
        user_id: userId || null
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save contact submission' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Contact submission saved:', data);

    // Send notification email
    try {
      const emailResponse = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['reginaldcosensiii@gmail.com'], // Updated with your actual email
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Project Type:</strong> ${projectType || 'Not provided'}</p>
          <p><strong>Budget:</strong> ${budget || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Submission ID: ${data.id}</small></p>
          <p><small>Submitted at: ${new Date(data.created_at).toLocaleString()}</small></p>
        `,
      });

      console.log('Notification email sent successfully:', emailResponse);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the entire request if email fails - the contact was still saved
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in submit-contact function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
