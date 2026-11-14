import { useQuery } from '@tanstack/react-query';

export interface EdgeConfigFeatures {
  openToWork: boolean;
  role: string;
  availableForHire: boolean;
  announcement: string;
  featuredProject: string;
  environment: string;
  region: string;
}

const DEFAULT_CONFIG: EdgeConfigFeatures = {
  openToWork: true,
  role: 'Full Stack Engineer & System Designer',
  availableForHire: true,
  announcement: 'Welcome to my Windows XP portfolio! Powered 100% by the Vercel Ecosystem.',
  featuredProject: 'Digital Campus Inventory',
  environment: 'production',
  region: 'bom1',
};

export const useEdgeConfig = () => {
  return useQuery<EdgeConfigFeatures>({
    queryKey: ['edge-config'],
    queryFn: async (): Promise<EdgeConfigFeatures> => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error('Failed to load edge config');
        const data = await res.json();
        return { ...DEFAULT_CONFIG, ...data };
      } catch (err) {
        return DEFAULT_CONFIG;
      }
    },
    initialData: DEFAULT_CONFIG,
    staleTime: 60 * 1000, // 1 minute
  });
};
