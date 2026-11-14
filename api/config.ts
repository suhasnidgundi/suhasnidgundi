// Dynamic Configuration & Profile API fusing Vercel Edge Config and Vercel Blob Storage
import { get } from '@vercel/edge-config';
import { put, list } from '@vercel/blob';
import { createHmac } from 'crypto';

function verifyAdminRequest(req: Request): { authorized: boolean; reason?: string } {
  const customKey = req.headers.get('x-admin-key');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SuhasAdmin@2026!';
  if (customKey && customKey === ADMIN_PASSWORD) return { authorized: true };

  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, reason: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.substring(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) return { authorized: false, reason: 'Malformed token' };

  const [header, payload, signature] = parts;
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'xp_jwt_suhas_sec_99a8b1c4d7e2f50821639a0b';
  const expectedSig = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSig) return { authorized: false, reason: 'Invalid signature' };

  let decoded: any;
  try {
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
  } catch {
    return { authorized: false, reason: 'Invalid payload' };
  }

  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    return { authorized: false, reason: 'Token expired' };
  }

  return { authorized: true };
}

export interface ProfileData {
  openToWork: boolean;
  role: string;
  availableForHire: boolean;
  announcement: string;
  featuredProject: string;
  environment: string;
  region: string;
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
  coreSkills: string[];
  resumeUrl?: string;
  resumeFilename?: string;
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
    // 1. Fetch live Edge Config values
    let edgeConfigData: Record<string, any> = {};
    if (process.env.EDGE_CONFIG) {
      try {
        const [
          openToWork,
          status,
          announcement,
          featuredProject,
          name,
          title,
          role,
          headline,
          location,
          email,
          github,
          linkedin,
          website,
          resumeUrl,
          resumeFilename,
        ] = await Promise.all([
          get('openToWork'),
          get('status'),
          get('announcement'),
          get('featuredProject'),
          get('name'),
          get('title'),
          get('role'),
          get('headline'),
          get('location'),
          get('email'),
          get('github'),
          get('linkedin'),
          get('website'),
          get('resumeUrl'),
          get('resumeFilename'),
        ]);

        edgeConfigData = {
          openToWork: openToWork !== undefined ? Boolean(openToWork) : undefined,
          status: status ? String(status) : undefined,
          announcement: announcement ? String(announcement) : undefined,
          featuredProject: featuredProject ? String(featuredProject) : undefined,
          name: name ? String(name) : undefined,
          title: title ? String(title) : undefined,
          role: role ? String(role) : undefined,
          headline: headline ? String(headline) : undefined,
          location: location ? String(location) : undefined,
          email: email ? String(email) : undefined,
          github: github ? String(github) : undefined,
          linkedin: linkedin ? String(linkedin) : undefined,
          website: website ? String(website) : undefined,
          resumeUrl: resumeUrl ? String(resumeUrl) : undefined,
          resumeFilename: resumeFilename ? String(resumeFilename) : undefined,
        };
      } catch (e) {
        console.warn('Edge config read skipped:', e);
      }
    }

    // 2. Fetch from Vercel Blob
    const blobProfile = await fetchBlobProfile();

    // 3. Fallback baseline if blob is empty, optionally overridden by environment variables
    const baseline: ProfileData = {
      openToWork: process.env.PORTFOLIO_OPEN_TO_WORK ? process.env.PORTFOLIO_OPEN_TO_WORK === 'true' : true,
      role: process.env.PORTFOLIO_ROLE || 'Full Stack Engineer & System Designer',
      availableForHire: true,
      announcement: process.env.PORTFOLIO_ANNOUNCEMENT || 'Welcome to my portfolio! Powered dynamically by the Vercel ecosystem.',
      featuredProject: process.env.PORTFOLIO_FEATURED_PROJECT || '',
      environment: process.env.VERCEL_ENV || 'production',
      region: process.env.VERCEL_REGION || 'bom1',
      name: process.env.PORTFOLIO_NAME || 'Suhas Nidgundi',
      handle: process.env.PORTFOLIO_HANDLE || 'suhasnidgundi',
      title: process.env.PORTFOLIO_TITLE || 'Full Stack Software Engineer & System Designer',
      headline: process.env.PORTFOLIO_HEADLINE || 'Building high-impact systems, distributed architectures, and nostalgic web experiences',
      location: process.env.PORTFOLIO_LOCATION || 'Belgaum / Pune, India',
      email: process.env.PORTFOLIO_EMAIL || 'suhasnidgundi@gmail.com',
      github: process.env.PORTFOLIO_GITHUB || 'https://github.com/suhasnidgundi',
      linkedin: process.env.PORTFOLIO_LINKEDIN || 'https://linkedin.com/in/suhasnidgundi',
      website: process.env.PORTFOLIO_WEBSITE || 'https://suhasnidgundi.tech',
      status: process.env.PORTFOLIO_STATUS || 'Available for exciting Full Stack & System Engineering opportunities',
      coreSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Vercel', 'PostgreSQL', 'Docker'],
      resumeUrl: process.env.PORTFOLIO_RESUME_URL || '',
      resumeFilename: process.env.PORTFOLIO_RESUME_FILENAME || '',
      updatedAt: new Date().toISOString(),
    };

    // Fuse baseline, blob profile, and edge config (Edge Config has top priority)
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
      JSON.stringify({ error: err.message || 'Failed to fetch config & profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
