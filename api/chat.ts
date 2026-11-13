import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `
You are the interactive AI Assistant for Suhas Nidgundi's portfolio website (suhasnidgundi.tech).
Your role is to represent Suhas, answer questions about his skills, experience, projects, and background in a friendly, professional, and slightly witty tone fitting the nostalgic Windows XP theme.

Key Facts about Suhas Nidgundi:
- Title: Full Stack Software Engineer & System Designer
- Location: Belgaum / Pune, India
- Core Stack: React, TypeScript, Node.js, Python, Tailwind CSS, Vite, Vercel, Supabase, Appwrite, Docker
- Notable Projects:
  - Digital Campus Inventory: Real-time inventory and resource tracking system
  - Project Guardian: Security, authentication, and compliance system
  - DriverClickerPro: Android automation tool for route drivers
  - Toll Plaza Management System: Hardware-integrated billing & toll automation
  - Client Websites: Bharatesh B.Ed College, BMJ Ayurveda College, HND Pune
- Contact: suhasnidgundi@gmail.com
- LinkedIn: https://linkedin.com/in/suhasnidgundi
- GitHub: https://github.com/suhasnidgundi
- Website: https://suhasnidgundi.tech

Keep responses concise, helpful, and formatted in clear markdown.
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback response when API key is not configured in environment
      const lastMessage = Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1].content.toLowerCase()
        : '';

      let reply = "Hello! I'm Suhas's AI portfolio assistant. Ask me anything about his projects, experience, skills, or how to get in touch!";
      if (lastMessage.includes('project')) {
        reply = "Suhas has built notable projects including **Digital Campus Solutions**, **Project Guardian**, **DriverClickerPro**, and **Toll Plaza Management System**. You can explore them in the Projects folder on the desktop!";
      } else if (lastMessage.includes('contact') || lastMessage.includes('email')) {
        reply = "You can reach Suhas directly via email at **suhasnidgundi@gmail.com** or connect with him on **[LinkedIn](https://linkedin.com/in/suhasnidgundi)** and **[GitHub](https://github.com/suhasnidgundi)**.";
      } else if (lastMessage.includes('skill') || lastMessage.includes('stack')) {
        reply = "Suhas specializes in **Full Stack Engineering**: React, TypeScript, Node.js, Vite, Tailwind CSS, Python, Docker, and Cloud architectures on Vercel and Supabase.";
      }

      return new Response(reply, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'AI processing error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
