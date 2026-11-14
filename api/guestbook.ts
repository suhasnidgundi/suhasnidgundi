// Serverless Guestbook API supporting Upstash Redis / Vercel Blob / Postgres
import { put, list } from '@vercel/blob';
import { verifyAdminRequest } from './_auth';

export interface GuestbookEntry {
  id: string;
  name: string;
  company?: string;
  message: string;
  createdAt: string;
  badge?: string;
}

const INITIAL_ENTRIES: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: 'Sarah Chen',
    company: 'Staff Frontend Engineer @ SF',
    message: 'The Windows XP fidelity here is jaw-dropping! The Luna caption buttons and Explorer navigation are so authentic. Great work!',
    createdAt: '2026-11-13T18:24:00Z',
    badge: 'Recruiter Favorite',
  },
  {
    id: 'gb-2',
    name: 'Alexandre Dubois',
    company: 'Full Stack Architect @ Paris',
    message: 'Loved using Internet Explorer and the AI Assistant inside the XP desktop. One of the best portfolio concepts I have ever seen.',
    createdAt: '2026-11-12T14:10:00Z',
    badge: 'Verified Visitor',
  },
  {
    id: 'gb-3',
    name: 'Rohan Sharma',
    company: 'Tech Lead @ Bengaluru',
    message: 'Awesome portfolio Suhas! DriverClickerPro and Project Guardian look like great production applications. Let’s connect on LinkedIn!',
    createdAt: '2026-11-10T09:45:00Z',
    badge: 'Verified Visitor',
  },
];

let inMemoryEntries: GuestbookEntry[] = [...INITIAL_ENTRIES];

async function getBlobGuestbook(): Promise<GuestbookEntry[] | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: 'guestbook-entries.json' });
    const match = blobs.find((b) => b.pathname === 'guestbook-entries.json');
    if (!match) return null;
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Vercel Blob guestbook read error:', err);
    return null;
  }
}

async function saveBlobGuestbook(entries: GuestbookEntry[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    return await put('guestbook-entries.json', JSON.stringify(entries), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (err) {
    console.warn('Vercel Blob guestbook save error:', err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, message } = body;

    if (!name || !message) {
      return new Response(
        JSON.stringify({ error: 'Name and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name: String(name).slice(0, 60).trim(),
      company: company ? String(company).slice(0, 80).trim() : undefined,
      message: String(message).slice(0, 500).trim(),
      createdAt: new Date().toISOString(),
      badge: 'New Signer',
    };

    // 1. Upstash Redis
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      try {
        await fetch(`${redisUrl}/lpush/portfolio_guestbook/${encodeURIComponent(JSON.stringify(newEntry))}`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        });
      } catch (e) {
        console.warn('Failed to save to Redis:', e);
      }
    }

    // 2. Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const current = (await getBlobGuestbook()) || inMemoryEntries;
        const updated = [newEntry, ...current];
        await saveBlobGuestbook(updated);
        inMemoryEntries = updated;

        return new Response(JSON.stringify({ success: true, entry: newEntry, source: 'blob' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.warn('Failed to save to Blob, fallback to memory:', e);
      }
    }

    inMemoryEntries = [newEntry, ...inMemoryEntries];

    return new Response(JSON.stringify({ success: true, entry: newEntry, source: 'memory' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || 'Failed to submit signature' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: Request) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/lrange/portfolio_guestbook/0/50`, {
        headers: { Authorization: `Bearer ${redisToken}` },
      });
      const data = await res.json();
      if (data && Array.isArray(data.result) && data.result.length > 0) {
        const parsed = data.result.map((item: string) => {
          try {
            return JSON.parse(decodeURIComponent(item));
          } catch {
            return null;
          }
        }).filter(Boolean);

        return new Response(JSON.stringify({ entries: parsed, source: 'upstash' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          },
        });
      }
    } catch (e) {
      console.warn('Redis read failed, falling back to Blob/memory:', e);
    }
  }

  // Check Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobEntries = await getBlobGuestbook();
      if (blobEntries && Array.isArray(blobEntries)) {
        return new Response(JSON.stringify({ entries: blobEntries, source: 'blob' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          },
        });
      }
    } catch (e) {
      console.warn('Vercel Blob read error, falling back to memory:', e);
    }
  }

  return new Response(
    JSON.stringify({
      entries: inMemoryEntries,
      source: 'memory',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    }
  );
}

export async function DELETE(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing entry id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const entries = (await getBlobGuestbook()) || inMemoryEntries;
    const filtered = entries.filter((e) => e.id !== id);

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await saveBlobGuestbook(filtered);
    }
    inMemoryEntries = filtered;

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to delete entry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



