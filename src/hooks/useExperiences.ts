import { useQuery } from '@tanstack/react-query';
import { INITIAL_EXPERIENCES, type Experience } from '@/data/portfolioData';

export { type Experience } from '@/data/portfolioData';

export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const res = await fetch('/api/experiences');
        if (!res.ok) throw new Error('Failed to fetch from API');
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : INITIAL_EXPERIENCES;
      } catch {
        return INITIAL_EXPERIENCES;
      }
    },
    initialData: INITIAL_EXPERIENCES,
  });
};

export const useCurrentExperience = () => {
  return useQuery({
    queryKey: ['current-experience'],
    queryFn: async (): Promise<Experience | null> => {
      try {
        const res = await fetch('/api/experiences?current=true');
        if (!res.ok) throw new Error('Failed to fetch current experience');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data[0];
        return INITIAL_EXPERIENCES.find((e) => e.is_current) || INITIAL_EXPERIENCES[0];
      } catch {
        return INITIAL_EXPERIENCES.find((e) => e.is_current) || INITIAL_EXPERIENCES[0];
      }
    },
    initialData: INITIAL_EXPERIENCES.find((e) => e.is_current) || INITIAL_EXPERIENCES[0],
  });
};

export const useExperiencesByType = (type: 'work' | 'education' | 'volunteer') => {
  return useQuery({
    queryKey: ['experiences', type],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const res = await fetch(`/api/experiences?type=${type}`);
        if (!res.ok) throw new Error('Failed to fetch experiences by type');
        const data = await res.json();
        return Array.isArray(data) ? data : INITIAL_EXPERIENCES.filter((e) => e.experience_type === type);
      } catch {
        return INITIAL_EXPERIENCES.filter((e) => e.experience_type === type);
      }
    },
    initialData: INITIAL_EXPERIENCES.filter((e) => e.experience_type === type),
  });
};
