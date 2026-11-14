import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { list } from '@vercel/blob';
import { get } from '@vercel/edge-config';

async function getLiveContext() {
  let projectsSummary = '';
  let profileSummary = '';
  let edgeStatus = '';

  try {
    // 1. Edge Config status
    if (process.env.EDGE_CONFIG) {
      const status = await get('status');
      const openToWork = await get('openToWork');
      edgeStatus = `Current Status: ${status || 'Available'}. Open to Work: ${openToWork ? 'Yes' : 'No'}`;
    }
  } catch (e) {
    console.warn('Edge config read in chat error:', e);
  }

  try {
    // 2. Vercel Blob projects & profile
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list();
      const projMatch = blobs.find((b) => b.pathname === 'projects.json');
      const profileMatch = blobs.find((b) => b.pathname === 'profile.json');

      if (projMatch) {
        const res = await fetch(`${projMatch.url}?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const projs = await res.json();
          projectsSummary = projs
            .map((p: any) => `- **${p.title}**: ${p.description} (Stack: ${p.tech_stack?.join(', ') || 'N/A'}; Metric: ${p.impact_metric || 'N/A'})`)
            .join('\n');
        }
      }

      if (profileMatch) {
        const res = await fetch(`${profileMatch.url}?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const prof = await res.json();
          profileSummary = `Name: ${prof.name}\nTitle: ${prof.title}\nBio: ${prof.headline}\nEmail: ${prof.email}\nGitHub: ${prof.github}\nLinkedIn: ${prof.linkedin}`;
        }
      }
    }
  } catch (e) {
    console.warn('Vercel Blob read in chat error:', e);
  }

  return { projectsSummary, profileSummary, edgeStatus };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const { projectsSummary, profileSummary, edgeStatus } = await getLiveContext();

    const dynamicSystemPrompt = `
You are the interactive AI Assistant for Suhas Nidgundi's portfolio website (suhasnidgundi.tech).
Your role is to represent Suhas, answer questions about his skills, experience, projects, and background in a friendly, professional, and slightly witty tone fitting the nostalgic Windows XP theme.
You are powered dynamically by the Vercel cloud ecosystem.

${profileSummary || 'Suhas Nidgundi: Full Stack Software Engineer & System Designer'}
${edgeStatus}

Live Projects currently stored in Vercel Blob:
${projectsSummary || '- Digital Campus Inventory\n- Project Guardian\n- DriverClickerPro\n- Toll Plaza Management System'}

Contact:
- Email: suhasnidgundi@gmail.com
- LinkedIn: https://linkedin.com/in/suhasnidgundi
- GitHub: https://github.com/suhasnidgundi
- Website: https://suhasnidgundi.tech

Keep responses concise, helpful, and formatted in clear markdown.
`;

    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      const lastMessage = Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1].content.toLowerCase()
        : '';

      let reply = "Hello! I'm Suhas's AI portfolio assistant. Ask me anything about his projects, experience, skills, or how to get in touch!";
      if (lastMessage.includes('project')) {
        reply = projectsSummary 
          ? `Here are Suhas's projects dynamically loaded from Vercel Cloud:\n\n${projectsSummary}`
          : "Suhas has built notable projects including **Digital Campus Solutions**, **Project Guardian**, **DriverClickerPro**, and **Toll Plaza Management System**.";
      } else if (lastMessage.includes('contact') || lastMessage.includes('email')) {
        reply = "You can reach Suhas directly via email at **suhasnidgundi@gmail.com** or connect with him on **[LinkedIn](https://linkedin.com/in/suhasnidgundi)** and **[GitHub](https://github.com/suhasnidgundi)**.";
      } else if (lastMessage.includes('skill') || lastMessage.includes('stack')) {
        reply = "Suhas specializes in **Full Stack Engineering**: React, TypeScript, Node.js, Vite, Tailwind CSS, Python, Docker, and Cloud architectures on Vercel and Supabase.";
      }

      return new Response(reply, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: dynamicSystemPrompt,
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
