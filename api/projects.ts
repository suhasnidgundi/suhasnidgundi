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

const INITIAL_PROJECTS: Project[] = [
  {
    $id: 'proj-1',
    title: 'Digital Campus Inventory',
    description:
      'Enterprise inventory and resource tracking system for academic institutions, featuring real-time stock monitoring and equipment dispatch.',
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
    description:
      'Security compliance, active endpoint monitoring, and access control management dashboard built for system integrity.',
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
    description:
      'High-speed Android accessibility and automation utility created to optimize route drivers and logistics workflows.',
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
    description:
      'Vehicle classification and automated toll calculation system with real-time billing and hardware barrier integration.',
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
    description:
      'Official institutional web portal and clinical hospital platform serving faculty, medical students, and patient inquiries.',
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
    description:
      'Educational portal managing academic admissions, syllabus archives, and faculty profiles for a premier teacher-training institution.',
    tech_stack: ['React', 'JavaScript', 'Vercel', 'HTML5'],
    impact_metric: 'Official college web portal',
    github_url: 'https://github.com/suhasnidgundi',
    live_url: 'https://bharateshbedcollege.org',
    is_featured: false,
    display_order: 6,
  },
];

export async function GET(req: Request) {
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

export default async function handler(req: Request) {
  return GET(req);
}
