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

// 0 hardcoded fallback projects - strictly populated from Vercel Ecosystem
export const INITIAL_PROJECTS: Project[] = [];

// 0 hardcoded fallback experiences - strictly populated from Vercel Ecosystem
export const INITIAL_EXPERIENCES: Experience[] = [];
