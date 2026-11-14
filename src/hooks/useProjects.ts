import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Project } from '@/data/portfolioData';

export { type Project } from '@/data/portfolioData';

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        const res = await fetch('/api/projects');
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

export const useFeaturedProject = () => {
  return useQuery<Project | null>({
    queryKey: ['featured-project'],
    queryFn: async (): Promise<Project | null> => {
      try {
        const res = await fetch('/api/projects?featured=true');
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data[0];
        return null;
      } catch (err) {
        return null;
      }
    },
    initialData: null,
    staleTime: 30 * 1000,
  });
};

export const useSaveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error('Failed to save project');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['featured-project'] });
    },
  });
};
