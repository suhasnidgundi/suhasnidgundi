import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminAuthHeaders } from '@/contexts/AuthContext';
import { DEFAULT_PROFILE, type DynamicProfile } from '@/config/profile';

export type { DynamicProfile } from '@/config/profile';

export const useProfile = () => {
  return useQuery<DynamicProfile>({
    queryKey: ['profile'],
    queryFn: async (): Promise<DynamicProfile> => {
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
