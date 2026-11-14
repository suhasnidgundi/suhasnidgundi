import { INITIAL_PROJECTS } from './data/portfolioData';

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const featuredOnly = url.searchParams.get('featured') === 'true';

    let projects = [...INITIAL_PROJECTS];

    if (featuredOnly) {
      projects = projects.filter((p) => p.is_featured);
    }

    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch projects' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
