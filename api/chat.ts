import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { list } from '@vercel/blob';
import { get } from '@vercel/edge-config';

interface LiveProfile {
  name: string;
  title: string;
  headline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  status: string;
  coreSkills: string[];
  featuredProject?: string;
}

const DEFAULT_PROFILE: LiveProfile = {
  name: process.env.PORTFOLIO_NAME || 'Portfolio Owner',
  title: process.env.PORTFOLIO_TITLE || 'Full Stack Software Engineer & System Designer',
  headline: process.env.PORTFOLIO_HEADLINE || 'Building high-impact systems and web experiences',
  location: process.env.PORTFOLIO_LOCATION || 'Belgaum / Pune, India',
  email: process.env.PORTFOLIO_EMAIL || 'suhasnidgundi@gmail.com',
  github: process.env.PORTFOLIO_GITHUB || 'https://github.com/suhasnidgundi',
  linkedin: process.env.PORTFOLIO_LINKEDIN || 'https://linkedin.com/in/suhasnidgundi',
  website: process.env.PORTFOLIO_WEBSITE || 'https://suhasnidgundi.tech',
  status: process.env.PORTFOLIO_STATUS || 'Available for exciting opportunities',
  coreSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Vercel', 'PostgreSQL', 'Docker'],
  featuredProject: process.env.PORTFOLIO_FEATURED_PROJECT || '',
};

async function getLiveContext(): Promise<{
  projectsSummary: string;
  profileData: LiveProfile;
  edgeStatus: string;
}> {
  let projectsSummary = '';
  let profileData: LiveProfile = { ...DEFAULT_PROFILE };
  let edgeStatus = '';

  try {
    // 1. Edge Config status & live profile overrides
    if (process.env.EDGE_CONFIG) {
      const [status, openToWork, name, title, email, headline, featuredProject] = await Promise.all([
        get('status'),
        get('openToWork'),
        get('name'),
        get('title'),
        get('email'),
        get('headline'),
        get('featuredProject'),
      ]);

      edgeStatus = `Current Status: ${status || profileData.status}. Open to Work: ${openToWork !== false ? 'Yes' : 'No'}`;
      if (name) profileData.name = String(name);
      if (title) profileData.title = String(title);
      if (email) profileData.email = String(email);
      if (headline) profileData.headline = String(headline);
      if (featuredProject) profileData.featuredProject = String(featuredProject);
      if (status) profileData.status = String(status);
    }
  } catch (e) {
    console.warn('Edge config read in chat error:', e);
  }

  try {
    // 2. Vercel Blob projects & profile.json
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list();
      const projMatch = blobs.find((b) => b.pathname === 'projects.json');
      const profileMatch = blobs.find((b) => b.pathname === 'profile.json');

      if (projMatch) {
        const res = await fetch(`${projMatch.url}?t=${Date.now()}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const projs = await res.json();
          projectsSummary = projs
            .map(
              (p: any) =>
                `- **${p.title}**: ${p.description} (Stack: ${p.tech_stack?.join(', ') || 'N/A'}; Metric: ${
                  p.impact_metric || 'N/A'
                })`
            )
            .join('\n');
        }
      }

      if (profileMatch) {
        const res = await fetch(`${profileMatch.url}?t=${Date.now()}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const prof = await res.json();
          profileData = {
            ...profileData,
            ...prof,
          };
        }
      }
    }
  } catch (e) {
    console.warn('Vercel Blob read in chat error:', e);
  }

  return { projectsSummary, profileData, edgeStatus };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const { projectsSummary, profileData, edgeStatus } = await getLiveContext();

    const dynamicSystemPrompt = `
You are the interactive AI Assistant for ${profileData.name}'s portfolio website (${profileData.website}).
Your role is to represent ${profileData.name}, answer questions about their skills, experience, projects, and background in a friendly, professional, and slightly witty tone fitting the nostalgic Windows XP and Windows Phone theme.
You are powered dynamically by the Vercel cloud ecosystem (Edge Config, Blob Storage, and Serverless compute).

Title: ${profileData.title}
Bio: ${profileData.headline}
Location: ${profileData.location}
Status: ${profileData.status}
${edgeStatus}
Skills: ${profileData.coreSkills?.join(', ') || 'React, TypeScript, Node.js, Python'}

Live Projects currently stored in Vercel Blob:
${projectsSummary || 'None currently published.'}

Contact:
- Email: ${profileData.email}
- LinkedIn: ${profileData.linkedin}
- GitHub: ${profileData.github}
- Website: ${profileData.website}

Keep responses concise, helpful, and formatted in clear markdown.
`;

    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      const lastMessage =
        Array.isArray(messages) && messages.length > 0
          ? messages[messages.length - 1].content.toLowerCase()
          : '';

      let reply = `Hello! I'm ${profileData.name}'s AI portfolio assistant. Ask me anything about their projects, experience, skills, or how to get in touch!`;
      if (lastMessage.includes('project')) {
        reply = projectsSummary
          ? `Here are ${profileData.name}'s projects dynamically loaded from Vercel Cloud:\n\n${projectsSummary}`
          : `There are currently no projects published in this portfolio. You can manage projects via the Admin dashboard at /admin.`;
      } else if (lastMessage.includes('contact') || lastMessage.includes('email')) {
        reply = `You can reach ${profileData.name} directly via email at **${profileData.email}** or connect on **[LinkedIn](${profileData.linkedin})** and **[GitHub](${profileData.github})**.`;
      } else if (lastMessage.includes('skill') || lastMessage.includes('stack')) {
        reply = `${profileData.name} specializes in: **${profileData.coreSkills?.join(', ') || 'Full Stack Web Development'}**.`;
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
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Chat processing error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
