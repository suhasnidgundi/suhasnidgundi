import { useQuery } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { Project } from '@/integrations/appwrite/types';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        [Query.orderAsc('display_order')]
      );
      return response.documents as unknown as Project[];
    },
  });
};

export const useFeaturedProject = () => {
  return useQuery({
    queryKey: ['featured-project'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        [
          Query.equal('is_featured', true),
          Query.limit(1)
        ]
      );
      return (response.documents[0] as unknown as Project) ?? null;
    },
  });
};
