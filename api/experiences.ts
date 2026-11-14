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

const INITIAL_EXPERIENCES: Experience[] = [
  {
    $id: 'exp-1',
    role: 'Full Stack Software Engineer',
    company: 'Independent Consultant / Freelance',
    description:
      'Designing and deploying end-to-end web applications, automated workflow systems, and cloud infrastructure on Vercel and AWS for enterprise, healthcare, and education clients.',
    start_date: '2023',
    is_current: true,
    experience_type: 'work',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Vercel', 'PostgreSQL', 'Docker'],
    display_order: 1,
  },
  {
    $id: 'exp-2',
    role: 'Software Systems Developer',
    company: 'Digital Campus Solutions',
    description:
      'Built asset tracking architectures, automated database reporting pipelines, and responsive management dashboards for campus inventory management.',
    start_date: '2022',
    end_date: '2023',
    is_current: false,
    experience_type: 'work',
    skills: ['TypeScript', 'React', 'REST APIs', 'PostgreSQL', 'Vite', 'Git'],
    display_order: 2,
  },
  {
    $id: 'exp-3',
    role: 'Bachelor of Engineering (Computer Science)',
    company: 'Visvesvaraya Technological University (VTU)',
    description:
      'Focused on Distributed Systems, Algorithms, Software Engineering, Database Management, and Network Security.',
    start_date: '2019',
    end_date: '2023',
    is_current: false,
    experience_type: 'education',
    skills: ['Algorithms', 'Data Structures', 'Database Design', 'System Architecture'],
    display_order: 3,
  },
];

export async function GET(req: Request) {
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


