import { z } from 'zod';

export const config = {
  runtime: 'edge',
};

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  subject: z.string().optional(),
});

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { name, email, message, subject } = result.data;

    // Optional: forward to Webhook / EmailJS REST if env vars are present
    const emailJsService = process.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID;
    const emailJsTemplate = process.env.VITE_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
    const emailJsUser = process.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;

    if (emailJsService && emailJsTemplate && emailJsUser) {
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailJsService,
            template_id: emailJsTemplate,
            user_id: emailJsUser,
            template_params: {
              from_name: name,
              from_email: email,
              subject: subject || 'Portfolio Contact',
              message,
            },
          }),
        });
      } catch (err) {
        console.error('EmailJS forwarding error:', err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message received successfully! Suhas will get back to you soon.',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
