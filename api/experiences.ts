import { INITIAL_EXPERIENCES } from './data/portfolioData';

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const currentOnly = url.searchParams.get('current') === 'true';

    let experiences = [...INITIAL_EXPERIENCES];

    if (currentOnly) {
      experiences = experiences.filter((e) => e.is_current);
    } else if (type) {
      experiences = experiences.filter((e) => e.experience_type === type);
    }

    return new Response(JSON.stringify(experiences), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch experiences' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
