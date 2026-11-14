// Serverless Visitor Counter API with Upstash Redis / Vercel KV / Vercel Blob persistence

let memoryTotal = 1;
let memoryToday = 1;
let lastResetDate = new Date().toDateString();

export default async function handler(req: Request) {
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    memoryToday = 0;
    lastResetDate = currentDate;
  }

  // Upstash Redis or Vercel KV credentials
  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  // POST: Increment count
  if (req.method === 'POST') {
    if (redisUrl && redisToken) {
      try {
        const todayKey = `visitors:${new Date().toISOString().slice(0, 10)}`;
        
        // Atomic increment in Redis
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
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (e) {
        console.warn('Upstash Redis error, using in-memory counter:', e);
      }
    }

    // In-memory serverless counter (when Redis is not yet linked)
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
        headers: { 'Content-Type': 'application/json' },
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
      console.warn('Upstash Redis read error, using in-memory counter:', e);
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
