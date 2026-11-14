// Dynamic WordPad Story & Case Studies API backed by Vercel Blob Storage
import { put, list } from '@vercel/blob';

const BLOB_NAME = 'wordpad-story.json';

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
            const data = await res.json();
            return new Response(JSON.stringify({ ...data, source: 'blob' }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
              },
            });
          }
        }
      } catch (err) {
        console.warn('Vercel Blob wordpad read error:', err);
      }
    }

    return new Response(JSON.stringify({ error: 'Wordpad story not found in blob' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const updated = {
        ...body,
        updatedAt: new Date().toISOString(),
      };

      const blob = await put(BLOB_NAME, JSON.stringify(updated, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      return new Response(JSON.stringify({ success: true, url: blob.url }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Blob token not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to save story' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
