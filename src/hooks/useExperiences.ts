import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Experience } from '@/data/portfolioData';

export { type Experience } from '@/data/portfolioData';

export const useExperiences = (type?: 'work' | 'education' | 'volunteer') => {
  return useQuery<Experience[]>({
    queryKey: ['experiences', type],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const url = type ? `/api/experiences?type=${type}` : '/api/experiences';
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        return [];
      }
    },
    initialData: [],
    staleTime: 30 * 1000,
  });
};

export const useCurrentExperiences = () => {
  return useQuery<Experience[]>({
    queryKey: ['experiences', 'current'],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const res = await fetch('/api/experiences?current=true');
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        return [];
      }
    },
    initialData: [],
    staleTime: 30 * 1000,
  });
};

export const useCurrentExperience = () => {
  return useQuery<Experience | null>({
    queryKey: ['experience', 'current-single'],
    queryFn: async (): Promise<Experience | null> => {
      try {
        const res = await fetch('/api/experiences?current=true');
        if (!res.ok) return null;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data[0] : null;
      } catch (err) {
        return null;
      }
    },
    initialData: null,
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
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
};
