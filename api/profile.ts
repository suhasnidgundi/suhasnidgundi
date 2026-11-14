// Dynamic Profile API fusing Vercel Edge Config and Vercel Blob Storage
import { get } from '@vercel/edge-config';
import { put, list } from '@vercel/blob';

export interface ProfileData {
  name: string;
  handle: string;
  title: string;
  headline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  website: string;
  status: string;
  openToWork: boolean;
  announcement?: string;
  featuredProject?: string;
  coreSkills: string[];
  updatedAt: string;
}

const BLOB_NAME = 'profile.json';

async function fetchBlobProfile(): Promise<Partial<ProfileData> | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    const match = blobs.find((b) => b.pathname === BLOB_NAME);
    if (!match) return null;
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Vercel Blob profile read error:', err);
    return null;
  }
}

async function saveBlobProfile(data: Partial<ProfileData>) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  return await put(BLOB_NAME, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function GET(req: Request) {
  try {
    // 1. Fetch from Edge Config (live edge values)
    let edgeConfigData: Record<string, any> = {};
    if (process.env.EDGE_CONFIG) {
      try {
        const [openToWork, status, announcement, featuredProject] = await Promise.all([
          get('openToWork'),
          get('status'),
          get('announcement'),
          get('featuredProject'),
        ]);
        edgeConfigData = {
          openToWork: openToWork !== undefined ? Boolean(openToWork) : undefined,
          status: status ? String(status) : undefined,
          announcement: announcement ? String(announcement) : undefined,
          featuredProject: featuredProject ? String(featuredProject) : undefined,
        };
      } catch (e) {
        console.warn('Edge config read skipped:', e);
      }
    }

    // 2. Fetch from Vercel Blob
    const blobProfile = await fetchBlobProfile();

    // 3. Fallback baseline if blob is empty
    const baseline: ProfileData = {
      name: 'Suhas Nidgundi',
      handle: 'suhasnidgundi',
      title: 'Full Stack Software Engineer & System Designer',
      headline: 'Building high-impact systems, distributed architectures, and nostalgic web experiences',
      location: 'Belgaum / Pune, India',
      email: 'suhasnidgundi@gmail.com',
      github: 'https://github.com/suhasnidgundi',
      linkedin: 'https://linkedin.com/in/suhasnidgundi',
      website: 'https://suhasnidgundi.tech',
      status: 'Available for exciting Full Stack & System Engineering opportunities',
      openToWork: true,
      announcement: 'Welcome to my portfolio! Built with React, Vite & Vercel ecosystem.',
      featuredProject: 'Digital Campus Inventory',
      coreSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Vercel', 'PostgreSQL', 'Docker'],
      updatedAt: new Date().toISOString(),
    };

    // Edge config overrides blob values for high-frequency flags
    const fused: ProfileData = {
      ...baseline,
      ...(blobProfile || {}),
      ...(Object.fromEntries(Object.entries(edgeConfigData).filter(([_, v]) => v !== undefined))),
      updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(fused), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = (await fetchBlobProfile()) || {};
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    await saveBlobProfile(updated);

    return new Response(JSON.stringify({ success: true, profile: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
