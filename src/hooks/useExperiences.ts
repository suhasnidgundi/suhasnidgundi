import { useQuery } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';
import type { Experience } from '@/integrations/appwrite/types';

export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.EXPERIENCES,
        [Query.orderAsc('display_order')]
      );
      return response.documents as unknown as Experience[];
    },
  });
};

export const useCurrentExperience = () => {
  return useQuery({
    queryKey: ['current-experience'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.EXPERIENCES,
        [
          Query.equal('is_current', true),
          Query.limit(1)
        ]
      );
      return (response.documents[0] as unknown as Experience) ?? null;
    },
  });
};

export const useExperiencesByType = (type: 'work' | 'education' | 'volunteer') => {
  return useQuery({
    queryKey: ['experiences', type],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.EXPERIENCES,
        [
          Query.equal('experience_type', type),
          Query.orderAsc('display_order')
        ]
      );
      return response.documents as unknown as Experience[];
    },
  });
};
