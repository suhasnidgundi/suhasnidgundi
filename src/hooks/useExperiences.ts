import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Experience, INITIAL_EXPERIENCES } from '@/data/portfolioData';

export { type Experience } from '@/data/portfolioData';

export const useExperiences = (type?: 'work' | 'education' | 'volunteer') => {
  const filteredInitial = type
    ? INITIAL_EXPERIENCES.filter((e) => e.experience_type === type)
    : INITIAL_EXPERIENCES;

  return useQuery<Experience[]>({
    queryKey: ['experiences', type],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const url = type ? `/api/experiences?type=${type}` : '/api/experiences';
        const res = await fetch(url);
        if (!res.ok) return filteredInitial;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : filteredInitial;
      } catch (err) {
        return filteredInitial;
      }
    },
    initialData: filteredInitial,
    staleTime: 30 * 1000,
  });
};

export const useCurrentExperiences = () => {
  const currentInitial = INITIAL_EXPERIENCES.filter((e) => e.is_current);
  return useQuery<Experience[]>({
    queryKey: ['experiences', 'current'],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const res = await fetch('/api/experiences?current=true');
        if (!res.ok) return currentInitial;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : currentInitial;
      } catch (err) {
        return currentInitial;
      }
    },
    initialData: currentInitial,
    staleTime: 30 * 1000,
  });
};

export const useCurrentExperience = () => {
  const firstCurrent = INITIAL_EXPERIENCES.find((e) => e.is_current) || null;
  return useQuery<Experience | null>({
    queryKey: ['experience', 'current-single'],
    queryFn: async (): Promise<Experience | null> => {
      try {
        const res = await fetch('/api/experiences?current=true');
        if (!res.ok) return firstCurrent;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data[0] : firstCurrent;
      } catch (err) {
        return firstCurrent;
      }
    },
    initialData: firstCurrent,
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
