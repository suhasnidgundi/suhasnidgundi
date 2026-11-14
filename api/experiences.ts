// Dynamic Experiences API backed comprehensively by Vercel Blob Storage
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

export interface Experience {
  $id: string;
  role: string;
  company: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  experience_type: 'work' | 'education' | 'volunteer';
  skills: string[];
  display_order: number;
}

const BLOB_NAME = 'experiences.json';

async function fetchBlobExperiences(): Promise<Experience[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    const match = blobs.find((b) => b.pathname === BLOB_NAME);
    if (!match) return [];
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Vercel Blob experiences read error:', err);
    return [];
  }
}

async function saveBlobExperiences(experiences: Experience[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  return await put(BLOB_NAME, JSON.stringify(experiences, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const currentOnly = url.searchParams.get('current') === 'true';

    let experiences = await fetchBlobExperiences();

    if (currentOnly) {
      experiences = experiences.filter((e) => e.is_current);
    } else if (type) {
      experiences = experiences.filter((e) => e.experience_type === type);
    }

    experiences.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return new Response(JSON.stringify(experiences), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch experiences' }),
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
    const { role, company, description, start_date } = body;

    if (!role || !company) {
      return new Response(
        JSON.stringify({ error: 'Role and company are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const experiences = await fetchBlobExperiences();
    const newExperience: Experience = {
      $id: body.$id || `exp-${Date.now()}`,
      role: String(role).trim(),
      company: String(company).trim(),
      description: description ? String(description).trim() : '',
      start_date: start_date ? String(start_date).trim() : '2024',
      end_date: body.end_date ? String(body.end_date).trim() : undefined,
      is_current: Boolean(body.is_current),
      experience_type: body.experience_type || 'work',
      skills: Array.isArray(body.skills) ? body.skills : [],
      display_order: Number(body.display_order) || experiences.length + 1,
    };

    const updated = [...experiences, newExperience];
    await saveBlobExperiences(updated);

    return new Response(JSON.stringify({ success: true, experience: newExperience }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create experience' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return new Response(JSON.stringify({ error: auth.reason || 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    let experiences = await fetchBlobExperiences();

    if (Array.isArray(body)) {
      await saveBlobExperiences(body);
      return new Response(JSON.stringify({ success: true, experiences: body }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetId = body.$id;
    if (!targetId) {
      return new Response(
        JSON.stringify({ error: 'Experience $id is required for update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const index = experiences.findIndex((e) => e.$id === targetId);
    if (index === -1) {
      experiences.push(body);
    } else {
      experiences[index] = { ...experiences[index], ...body };
    }

    await saveBlobExperiences(experiences);

    return new Response(JSON.stringify({ success: true, experience: experiences[index] || body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update experience' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
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
      return new Response(
        JSON.stringify({ error: 'Query param id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let experiences = await fetchBlobExperiences();
    const filtered = experiences.filter((e) => e.$id !== id);
    await saveBlobExperiences(filtered);

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to delete experience' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
