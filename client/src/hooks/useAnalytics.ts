import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

// Analytics hook for tracking user behavior
export function useAnalytics() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [location] = useLocation();
  const previousLocation = useRef<string>('');

  // Initialize analytics session
  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await fetch('/api/analytics/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.sessionId);
          
          // Store session ID in localStorage for persistence
          localStorage.setItem('analytics-session-id', data.sessionId);
        }
      } catch (error) {
        console.error('Failed to initialize analytics session:', error);
      }
    };

    // Check for existing session
    const existingSessionId = localStorage.getItem('analytics-session-id');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      initSession();
    }
  }, []);

  // Track page views
  useEffect(() => {
    if (!sessionId) return;

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/page-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            path: location,
            referrer: previousLocation.current || undefined
          })
        });
        
        previousLocation.current = location;
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [sessionId, location]);

  // Track cart events
  const trackCartEvent = async (
    type: 'add' | 'remove' | 'update' | 'clear' | 'checkout_start',
    productId?: string,
    quantity?: number,
    value?: number
  ) => {
    if (!sessionId) return;

    try {
      await fetch('/api/analytics/cart-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          type,
          productId,
          quantity,
          value
        })
      });
    } catch (error) {
      console.error('Failed to track cart event:', error);
    }
  };

  // Track conversions
  const trackConversion = async (
    type: 'purchase' | 'signup' | 'newsletter' | 'contact',
    orderId?: string,
    value?: number
  ) => {
    if (!sessionId) return;

    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          type,
          orderId,
          value
        })
      });
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  };

  return {
    sessionId,
    trackCartEvent,
    trackConversion
  };
}

// Hook for getting analytics data (admin use)
export function useAnalyticsData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAnalyticsSummary = async (days: number = 7) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analytics/summary?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch analytics summary');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDailyStats = async (date: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analytics/daily/${date}`);
      if (!response.ok) throw new Error('Failed to fetch daily stats');
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAnalyticsSummary,
    getDailyStats
  };
}