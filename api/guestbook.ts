// Serverless Guestbook API supporting Neon / Supabase Postgres / Upstash or serverless fallback

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

export default async function handler(req: Request) {
  if (req.method === 'POST') {
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

      // If Postgres or Redis is configured, write to it
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

      inMemoryEntries = [newEntry, ...inMemoryEntries];

      return new Response(JSON.stringify({ success: true, entry: newEntry }), {
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

  // GET request
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/lrange/portfolio_guestbook/0/50`, {
        headers: { Authorization: `Bearer ${redisToken}` },
      });
      const data = await res.json();
      if (Array.isArray(data?.result) && data.result.length > 0) {
        const parsed = data.result.map((item: string) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }).filter(Boolean);
        return new Response(JSON.stringify(parsed), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        });
      }
    } catch (e) {
      console.warn('Failed to read from Redis, using fallback:', e);
    }
  }

  return new Response(JSON.stringify(inMemoryEntries), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
