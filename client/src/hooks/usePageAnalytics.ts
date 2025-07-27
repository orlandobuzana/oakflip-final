import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

// Initialize analytics for each page component
export function usePageAnalytics() {
  const { sessionId } = useAnalytics();
  
  useEffect(() => {
    // Analytics is automatically tracked via useAnalytics hook
    // This hook can be used for page-specific analytics setup
  }, [sessionId]);
  
  return { sessionId };
}