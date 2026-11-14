import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Experience } from '@/data/portfolioData';

export { type Experience } from '@/data/portfolioData';

export const useExperiences = (type?: 'work' | 'education' | 'volunteer') => {
  return useQuery<Experience[]>({
    queryKey: ['experiences', type],
    queryFn: async (): Promise<Experience[]> => {
      const url = type ? `/api/experiences?type=${type}` : '/api/experiences';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch experiences from Vercel');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30 * 1000,
  });
};

export const useCurrentExperiences = () => {
  return useQuery<Experience[]>({
    queryKey: ['experiences', 'current'],
    queryFn: async (): Promise<Experience[]> => {
      const res = await fetch('/api/experiences?current=true');
      if (!res.ok) throw new Error('Failed to fetch current experiences');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30 * 1000,
  });
};

export const useCurrentExperience = () => {
  return useQuery<Experience | null>({
    queryKey: ['experience', 'current-single'],
    queryFn: async (): Promise<Experience | null> => {
      const res = await fetch('/api/experiences?current=true');
      if (!res.ok) throw new Error('Failed to fetch current experience');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    },
    staleTime: 30 * 1000,
  });
};

export const useSaveExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (experience: Partial<Experience>) => {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      });
      if (!res.ok) throw new Error('Failed to save experience');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
};
