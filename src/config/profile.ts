// Centralized Profile & Portfolio Configuration with Vercel Ecosystem Dynamic Sync
export interface DynamicProfile {
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
  availableForHire: boolean;
  announcement?: string;
  featuredProject?: string;
  environment: string;
  region: string;
  coreSkills: string[];
  resumeUrl?: string;
  resumeFilename: string;
  updatedAt?: string;
}

export const DEFAULT_PROFILE: DynamicProfile = {
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
  availableForHire: true,
  announcement: 'Welcome to my portfolio! Powered 100% dynamically by the Vercel Cloud Ecosystem.',
  featuredProject: '',
  environment: 'production',
  region: 'bom1',
  coreSkills: [],
  resumeUrl: '',
  resumeFilename: '',
  updatedAt: new Date().toISOString(),
};
