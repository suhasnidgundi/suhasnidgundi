// Dynamic Document Management API for Notepad and WordPad backed by Vercel Blob Storage
import { put, list } from '@vercel/blob';
import { createHmac } from 'crypto';

function verifyAdminRequest(req: Request): { authorized: boolean; reason?: string } {
  const customKey = req.headers.get('x-admin-key');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SuhasAdmin@2026!';
  if (customKey && customKey === ADMIN_PASSWORD) return { authorized: true };

  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, reason: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.substring(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return { authorized: false, reason: 'Malformed token' };

  const [header, payload, signature] = parts;
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'xp_jwt_suhas_sec_99a8b1c4d7e2f50821639a0b';
  const expectedSig = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSig) return { authorized: false, reason: 'Invalid signature' };

  let decoded: any;
  try {
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
  } catch {
    return { authorized: false, reason: 'Invalid payload' };
  }

  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    return { authorized: false, reason: 'Token expired' };
  }

  return { authorized: true };
}

const README_BLOB = 'readme.txt';
const WORDPAD_BLOB = 'wordpad-story.json';

const DEFAULT_README = `========================================================
  WELCOME TO SUHAS NIDGUNDI'S WINDOWS XP PORTFOLIO!
========================================================

Hi there! I am Suhas Nidgundi.
Full Stack Engineer & System Designer.

ABOUT THIS OS:
--------------------------------------------------------
This portfolio is a pixel-faithful recreation of Windows XP 
Professional Service Pack 2 (Luna Blue edition).
Powered 100% dynamically by the Vercel Cloud Ecosystem:
- Vercel Blob for persistent documents and data
- Vercel Edge Config for real-time announcements & status
- Vercel Serverless Functions with Web Fetch APIs
- Vercel Speed Insights & Web Analytics

WHAT YOU CAN DO:
- Double click "Projects" or "Experience" in My Computer 
  to browse my live work inside the same Explorer window!
- Open Internet Explorer to visit live websites and GitHub.
- Launch WordPad to read technical case studies.
- Open PDF Viewer to inspect or download my resume.
- Talk to the built-in AI Assistant for instant questions.
- Sign the live Vercel Blob guestbook!
- Check the retro LED visitor odometer on the taskbar.

CONNECT:
- GitHub: https://github.com/suhasnidgundi
- LinkedIn: https://linkedin.com/in/suhasnidgundi
- Email: suhasnidgundi@gmail.com

Enjoy exploring!
`;

const DEFAULT_WORDPAD = {
  title: 'Suhas Nidgundi',
  subtitle: 'Full Stack Engineer & System Designer building scalable systems, cloud-native services, and nostalgic web experiences.',
  contact: '📧 suhasnidgundi@gmail.com | 🔗 linkedin.com/in/suhasnidgundi | 💻 github.com/suhasnidgundi',
  sections: [
    {
      id: 'opening',
      heading: 'The Engineering Journey',
      paragraphs: [
        "I've always been captivated by how complex systems work beneath the surface. From opening hardware components as a kid to diving deep into distributed systems, network packets, and operating system internals, my passion is building robust software that makes an immediate, tangible impact.",
        "My father's Windows XP computer was my very first software playground. Exploring the desktop, running diagnostics, and tinkering with early web scripts sparked a lifelong curiosity for building delightful, resilient digital products.",
        "Engineering is about understanding the people who will use what you build and designing systems that make their workflows effortless, fast, and reliable."
      ]
    },
    {
      id: 'case-study-ace',
      heading: 'Building for Real Impact: Hospital & Healthcare Automation',
      paragraphs: [
        "During my engineering residency at ACE Hospital and Research Centre, I spent the first week observing clinical operations rather than writing code. Watching registration bottlenecks, manual paper queue slips, and lab sample handoffs revealed where modern web systems could eliminate hours of human fatigue.",
        "I architected RESTful APIs and digital queue dispatch dashboards that integrated directly with hospital databases. The automated patient entry workflows reduced patient intake time from 10 minutes down to under 4 minutes, lowered duplicate records to less than 1%, and made healthcare compliance audit logging automatic."
      ],
      highlights: [
        'Patient registration intake dropped from 10 minutes to under 4 minutes',
        'Digital patient queue dispatch eliminated paper slip errors',
        'Automated audit logging achieved 100% NABH compliance',
        'Zero-latency real-time state synchronization across clinic desks'
      ]
    },
    {
      id: 'cloud-architecture',
      heading: 'Modern Web & Vercel Cloud Native Architecture',
      paragraphs: [
        "Today, I design and deploy full-stack applications with React, TypeScript, Node.js, Python, and the complete Vercel Ecosystem—leveraging Edge Config for instant configuration switches, Vercel Blob for persistent object storage, Serverless Functions for auto-scaling compute, and AI SDK for intelligent agentic capabilities.",
        "Whether designing real-time campus inventory trackers or creating authentic retro simulators, my goal is always software craftsmanship: high reliability, thoughtful UX, and zero friction."
      ]
    }
  ]
};

async function getBlobItem(blobName: string): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: blobName });
    const match = blobs.find((b) => b.pathname === blobName);
    if (!match) return null;
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.warn('Vercel Blob document read error:', err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'readme';

    if (type === 'wordpad' || type === 'story') {
      const text = await getBlobItem(WORDPAD_BLOB);
      if (text) {
        try {
          const data = JSON.parse(text);
          return new Response(JSON.stringify({ ...data, source: 'blob' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            },
          });
        } catch {}
      }
      return new Response(JSON.stringify({ ...DEFAULT_WORDPAD, source: 'default' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default: README text
    const text = await getBlobItem(README_BLOB);
    return new Response(JSON.stringify({ content: text || DEFAULT_README, source: text ? 'blob' : 'default' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to read document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Admin login required to save document to Blob' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'readme';
    const body = await req.json();

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response(JSON.stringify({ error: 'Blob token missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type === 'wordpad' || type === 'story') {
      const payload = {
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const blob = await put(WORDPAD_BLOB, JSON.stringify(payload, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return new Response(JSON.stringify({ success: true, url: blob.url }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // README save
    const content = typeof body === 'string' ? body : (body.content || '');
    const blob = await put(README_BLOB, content, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return new Response(JSON.stringify({ success: true, url: blob.url, source: 'blob' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to save document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
