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

const BASELINE_PROJECTS: Project[] = [
  {
    $id: 'proj-1',
    title: 'Digital Campus Inventory',
    description: 'Enterprise inventory and resource tracking system for academic institutions, featuring real-time stock monitoring and equipment dispatch.',
    tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
    impact_metric: '40% reduction in manual audit time',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://suhasnidgundi.tech',
    is_featured: true,
    display_order: 1,
    problem_statement: 'Academic institutions struggle with disjointed physical asset logs and untracked laboratory equipment.',
    solution: 'Engineered a centralized real-time inventory management platform with role-based asset approvals.',
    contribution: 'Designed frontend architecture, database schema, and automated audit logging.',
  },
  {
    $id: 'proj-2',
    title: 'Project Guardian',
    description: 'Security compliance, active endpoint monitoring, and access control management dashboard built for system integrity.',
    tech_stack: ['React', 'TypeScript', 'Vercel', 'Tailwind', 'Docker'],
    impact_metric: 'Full enterprise compliance logging',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://suhasnidgundi.tech',
    is_featured: false,
    display_order: 2,
    problem_statement: 'System administrators needed unified visibility into access events, active sessions, and security alerts.',
    solution: 'Built an interactive dashboard monitoring real-time security events and permission policies.',
    contribution: 'Architected responsive UI, state store, and telemetry dashboards.',
  },
  {
    $id: 'proj-3',
    title: 'DriverClickerPro',
    description: 'High-speed Android accessibility and automation utility created to optimize route drivers and logistics workflows.',
    tech_stack: ['Kotlin', 'Android SDK', 'AccessibilityService', 'Automation'],
    impact_metric: '1,000+ driver actions automated',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://suhasnidgundi.tech',
    is_featured: false,
    display_order: 3,
    problem_statement: 'Delivery drivers face high friction interacting with multi-screen dispatch apps while navigating.',
    solution: 'Developed an automated background overlay tool using Android Accessibility APIs.',
    contribution: 'Implemented low-latency click simulation and multi-touch macro playback.',
  },
  {
    $id: 'proj-4',
    title: 'Toll Plaza Management System',
    description: 'Vehicle classification and automated toll calculation system with real-time billing and hardware barrier integration.',
    tech_stack: ['Python', 'OpenCV', 'React', 'FastAPI', 'PostgreSQL'],
    impact_metric: '60% faster lane throughput',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://suhasnidgundi.tech',
    is_featured: false,
    display_order: 4,
    problem_statement: 'Manual toll collection caused severe bottlenecking and inaccurate vehicle fee calculations.',
    solution: 'Designed automated barrier control and computer-vision classification pipelines.',
    contribution: 'Built operator UI and integrated camera stream processing.',
  },
  {
    $id: 'proj-5',
    title: 'BMJ Ayurveda College & Hospital',
    description: 'Official institutional web portal and clinical hospital platform serving faculty, medical students, and patient inquiries.',
    tech_stack: ['React', 'TypeScript', 'Vercel', 'Tailwind CSS'],
    impact_metric: 'Active hospital portal',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://bmjamc.org',
    is_featured: false,
    display_order: 5,
  },
  {
    $id: 'proj-6',
    title: 'Bharatesh B.Ed College Portal',
    description: 'Educational portal managing academic admissions, syllabus archives, and faculty profiles for a premier teacher-training institution.',
    tech_stack: ['React', 'JavaScript', 'Vercel', 'HTML5'],
    impact_metric: 'Official college web portal',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://bharateshbedcollege.org',
    is_featured: false,
    display_order: 6,
  },
];

async function fetchBlobProjects(): Promise<Project[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return BASELINE_PROJECTS;
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    const match = blobs.find((b) => b.pathname === BLOB_NAME);
    if (!match) return BASELINE_PROJECTS;
    const res = await fetch(`${match.url}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return BASELINE_PROJECTS;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : BASELINE_PROJECTS;
  } catch (err) {
    console.warn('Vercel Blob projects read error:', err);
    return BASELINE_PROJECTS;
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
