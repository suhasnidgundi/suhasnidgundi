// Serverless Visitor Counter API with Upstash Redis / Vercel KV / Vercel Blob persistence
import { put, list } from '@vercel/blob';

let memoryTotal = 1;
let memoryToday = 1;
let lastResetDate = new Date().toDateString();

async function getBlobCounterData() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: 'visitor-count.json' });
    const match = blobs.find((b) => b.pathname === 'visitor-count.json');
    if (!match) return null;
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Vercel Blob read error:', err);
    return null;
  }
}

async function saveBlobCounterData(data: { total: number; today: number; date: string }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const blob = await put('visitor-count.json', JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob;
  } catch (err) {
    console.warn('Vercel Blob save error:', err);
    return null;
  }
}

export default async function handler(req: Request) {
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    memoryToday = 0;
    lastResetDate = currentDate;
  }

  // 1. Upstash Redis or Vercel KV credentials
  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  // POST: Increment count
  if (req.method === 'POST') {
    // Attempt Upstash Redis first
    if (redisUrl && redisToken) {
      try {
        const todayKey = `visitors:${new Date().toISOString().slice(0, 10)}`;
        const [totalRes, todayRes] = await Promise.all([
          fetch(`${redisUrl}/incr/portfolio_visitors_total`, {
            headers: { Authorization: `Bearer ${redisToken}` },
          }).then((r) => r.json()),
          fetch(`${redisUrl}/incr/${todayKey}`, {
            headers: { Authorization: `Bearer ${redisToken}` },
          }).then((r) => r.json()),
        ]);

        return new Response(
          JSON.stringify({
            total: totalRes?.result || 1,
            today: todayRes?.result || 1,
            source: 'upstash',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
          }
        );
      } catch (e) {
        console.warn('Upstash Redis error, falling back to Blob/memory:', e);
      }
    }

    // Attempt Vercel Blob persistence
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const current = await getBlobCounterData();
        let total = current?.total ? Number(current.total) + 1 : 1;
        let today = 1;

        if (current && current.date === currentDate) {
          today = Number(current.today || 0) + 1;
        }

        const updatedData = { total, today, date: currentDate };
        await saveBlobCounterData(updatedData);

        return new Response(
          JSON.stringify({
            total,
            today,
            source: 'blob',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
          }
        );
      } catch (e) {
        console.warn('Vercel Blob counter error, falling back to memory:', e);
      }
    }

    // In-memory serverless counter fallback
    memoryTotal += 1;
    memoryToday += 1;

    return new Response(
      JSON.stringify({
        total: memoryTotal,
        today: memoryToday,
        source: 'memory',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      }
    );
  }

  // GET: Read count
  if (redisUrl && redisToken) {
    try {
      const todayKey = `visitors:${new Date().toISOString().slice(0, 10)}`;
      const [totalRes, todayRes] = await Promise.all([
        fetch(`${redisUrl}/get/portfolio_visitors_total`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        }).then((r) => r.json()),
        fetch(`${redisUrl}/get/${todayKey}`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        }).then((r) => r.json()),
      ]);

      const total = totalRes?.result ? parseInt(totalRes.result, 10) : 1;
      const today = todayRes?.result ? parseInt(todayRes.result, 10) : 1;

      return new Response(
        JSON.stringify({
          total,
          today,
          source: 'upstash',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
          },
        }
      );
    } catch (e) {
      console.warn('Upstash Redis read error, checking Blob:', e);
    }
  }

  // Check Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const current = await getBlobCounterData();
      if (current) {
        const total = current.total || 1;
        const today = current.date === currentDate ? current.today || 1 : 0;
        return new Response(
          JSON.stringify({
            total,
            today,
            source: 'blob',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
            },
          }
        );
      }
    } catch (e) {
      console.warn('Vercel Blob read error, falling back to memory:', e);
    }
  }

  return new Response(
    JSON.stringify({
      total: memoryTotal,
      today: memoryToday,
      source: 'memory',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
      },
    }
  );
}
