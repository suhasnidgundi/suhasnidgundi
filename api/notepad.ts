// Dynamic Notepad Document API backed by Vercel Blob Storage
import { put, list } from '@vercel/blob';

const BLOB_NAME = 'readme.txt';

const DEFAULT_CONTENT = `========================================================
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

export async function GET(req: Request) {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list({ prefix: BLOB_NAME });
        const match = blobs.find((b) => b.pathname === BLOB_NAME);
        if (match) {
          const res = await fetch(`${match.url}?t=${Date.now()}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(4000),
          });
          if (res.ok) {
            const text = await res.text();
            return new Response(JSON.stringify({ content: text, source: 'blob' }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
              },
            });
          }
        }
      } catch (err) {
        console.warn('Vercel Blob notepad read error:', err);
      }
    }

    return new Response(JSON.stringify({ content: DEFAULT_CONTENT, source: 'fallback' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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
    const body = await req.json();
    const { content } = body;

    if (typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Content string required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(BLOB_NAME, content, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      return new Response(JSON.stringify({ success: true, url: blob.url, source: 'blob' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, source: 'memory' }), {
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
