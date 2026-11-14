// Dynamic Projects API backed comprehensively by Vercel Blob Storage
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

export interface Project {
  $id: string;
  title: string;
  description: string;
  tech_stack: string[];
  impact_metric: string;
  screenshot_url?: string;
  github_url?: string;
  live_url?: string;
  is_featured: boolean;
  display_order: number;
  problem_statement?: string;
  solution?: string;
  contribution?: string;
}

const BLOB_NAME = 'projects.json';

async function fetchBlobProjects(): Promise<Project[]> {
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
    console.warn('Vercel Blob projects read error:', err);
    return [];
  }
}

async function saveBlobProjects(projects: Project[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  return await put(BLOB_NAME, JSON.stringify(projects, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const featuredOnly = url.searchParams.get('featured') === 'true';
    const id = url.searchParams.get('id');

    let projects = await fetchBlobProjects();

    if (id) {
      const match = projects.find((p) => p.$id === id);
      if (!match) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(match), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      });
    }

    if (featuredOnly) {
      projects = projects.filter((p) => p.is_featured);
    }

    // Sort by display order
    projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch projects' }),
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
    const { title, description, tech_stack, impact_metric } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: 'Title and description are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const projects = await fetchBlobProjects();
    const newProject: Project = {
      $id: body.$id || `proj-${Date.now()}`,
      title: String(title).trim(),
      description: String(description).trim(),
      tech_stack: Array.isArray(tech_stack) ? tech_stack : (tech_stack ? [String(tech_stack)] : []),
      impact_metric: impact_metric ? String(impact_metric).trim() : '',
      github_url: body.github_url ? String(body.github_url).trim() : undefined,
      live_url: body.live_url ? String(body.live_url).trim() : undefined,
      is_featured: Boolean(body.is_featured),
      display_order: Number(body.display_order) || projects.length + 1,
      problem_statement: body.problem_statement,
      solution: body.solution,
      contribution: body.contribution,
    };

    const updated = [...projects, newProject];
    await saveBlobProjects(updated);

    return new Response(JSON.stringify({ success: true, project: newProject }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create project' }),
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
    let projects = await fetchBlobProjects();

    if (Array.isArray(body)) {
      await saveBlobProjects(body);
      return new Response(JSON.stringify({ success: true, projects: body }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetId = body.$id;
    if (!targetId) {
      return new Response(
        JSON.stringify({ error: 'Project $id is required for update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const index = projects.findIndex((p) => p.$id === targetId);
    if (index === -1) {
      projects.push(body);
    } else {
      projects[index] = { ...projects[index], ...body };
    }

    await saveBlobProjects(projects);

    return new Response(JSON.stringify({ success: true, project: projects[index] || body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to update project' }),
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

    let projects = await fetchBlobProjects();
    const filtered = projects.filter((p) => p.$id !== id);
    await saveBlobProjects(filtered);

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to delete project' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
