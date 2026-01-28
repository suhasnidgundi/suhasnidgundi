import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ID } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/client';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.ANALYTICS,
          ID.unique(),
          {
            page_path: location.pathname,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
            visitor_country: null,
            visitor_city: null,
            visitor_region: null,
          }
        );
      } catch (error) {
        // Silently fail - analytics should not break the app
        console.debug('Analytics tracking failed:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};

export default useAnalytics;
