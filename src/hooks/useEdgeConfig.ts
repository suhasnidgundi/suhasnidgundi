import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PROFILE, type DynamicProfile } from '@/config/profile';

export type EdgeConfigFeatures = DynamicProfile;

export const useEdgeConfig = () => {
  return useQuery<EdgeConfigFeatures>({
    queryKey: ['edge-config'],
    queryFn: async (): Promise<EdgeConfigFeatures> => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) return DEFAULT_PROFILE;
        const data = await res.json();
        return { ...DEFAULT_PROFILE, ...data };
      } catch (err) {
        return DEFAULT_PROFILE;
      }
    },
    initialData: DEFAULT_PROFILE,
    staleTime: 60 * 1000, // 1 minute
  });
};
