import { useQuery } from '@tanstack/react-query';
import { INITIAL_PROJECTS, type Project } from '@/data/portfolioData';

export { type Project } from '@/data/portfolioData';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch from API');
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : INITIAL_PROJECTS;
      } catch {
        return INITIAL_PROJECTS;
      }
    },
    initialData: INITIAL_PROJECTS,
  });
};

export const useFeaturedProject = () => {
  return useQuery({
    queryKey: ['featured-project'],
    queryFn: async (): Promise<Project | null> => {
      try {
        const res = await fetch('/api/projects?featured=true');
        if (!res.ok) throw new Error('Failed to fetch featured project');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data[0];
        return INITIAL_PROJECTS.find((p) => p.is_featured) || INITIAL_PROJECTS[0];
      } catch {
        return INITIAL_PROJECTS.find((p) => p.is_featured) || INITIAL_PROJECTS[0];
      }
    },
    initialData: INITIAL_PROJECTS.find((p) => p.is_featured) || INITIAL_PROJECTS[0],
  });
};
