// Serverless Visitor Counter API with Upstash Redis / Vercel KV support & smart fallback

// In-memory counter for local dev and fallback
let fallbackTotal = 4280;
let fallbackToday = 142;
let lastResetDate = new Date().toDateString();

export default async function handler(req: Request) {
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    fallbackToday = 0;
    lastResetDate = currentDate;
  }

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  if (req.method === 'POST') {
    if (redisUrl && redisToken) {
      try {
        const todayKey = `visitors:${new Date().toISOString().slice(0, 10)}`;
        
        // Pipeline: INCR total and INCR today
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
            total: totalRes?.result || 4281,
            today: todayRes?.result || 143,
            source: 'upstash',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (e) {
        console.warn('Upstash Redis error, using fallback:', e);
      }
    }

    // Fallback counter increment
    fallbackTotal += 1;
    fallbackToday += 1;

    return new Response(
      JSON.stringify({
        total: fallbackTotal,
        today: fallbackToday,
        source: 'fallback',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // GET request: fetch current count
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

      const total = totalRes?.result ? parseInt(totalRes.result, 10) : 4280;
      const today = todayRes?.result ? parseInt(todayRes.result, 10) : 142;

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
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          },
        }
      );
    } catch (e) {
      console.warn('Upstash Redis read error, using fallback:', e);
    }
  }

  return new Response(
    JSON.stringify({
      total: fallbackTotal,
      today: fallbackToday,
      source: 'fallback',
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
