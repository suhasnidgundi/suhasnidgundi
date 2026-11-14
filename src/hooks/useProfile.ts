import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminAuthHeaders } from '@/contexts/AuthContext';

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
  announcement?: string;
  featuredProject?: string;
  coreSkills: string[];
  updatedAt: string;
}

export const useProfile = () => {
  return useQuery<DynamicProfile>({
    queryKey: ['profile'],
    queryFn: async (): Promise<DynamicProfile> => {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error('Failed to fetch profile from Vercel');
      return await res.json();
    },
    staleTime: 30 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updated: Partial<DynamicProfile>) => {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['edge-config'] });
    },
  });
};
