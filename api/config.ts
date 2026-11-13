import { get } from '@vercel/edge-config';

export default async function handler(req: Request) {
  try {
    let edgeConfigData: any = null;

    if (process.env.EDGE_CONFIG) {
      try {
        edgeConfigData = {
          openToWork: await get('openToWork'),
          announcement: await get('announcement'),
          featuredProject: await get('featuredProject'),
        };
      } catch (e) {
        console.warn('Edge config read skipped:', e);
      }
    }

    const defaultFeatures = {
      openToWork: true,
      role: 'Full Stack Engineer & System Designer',
      availableForHire: true,
      announcement: 'Welcome to my portfolio! Built with React, Vite & Vercel.',
      featuredProject: 'Digital Campus Inventory',
      environment: process.env.VERCEL_ENV || 'development',
      region: process.env.VERCEL_REGION || 'local',
      ...edgeConfigData,
    };

    return new Response(JSON.stringify(defaultFeatures), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Config fetch error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
