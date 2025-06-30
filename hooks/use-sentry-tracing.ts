import * as Sentry from '@sentry/nextjs';
import { useCallback } from 'react';

export function useSentryTracing() {
  // Create a transaction for API calls
  const traceApiCall = useCallback(async (
    operation: string,
    apiCall: () => Promise<any>,
    tags?: Record<string, string>
  ) => {
    const transaction = Sentry.getCurrentHub().startTransaction({
      name: operation,
      op: 'http.request',
    });

    try {
      // Set tags for better filtering
      if (tags) {
        Object.entries(tags).forEach(([key, value]) => {
          transaction.setTag(key, value);
        });
      }

      const result = await apiCall();
      
      // Mark as successful
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      // Mark as failed and capture the error
      transaction.setStatus('internal_error');
      Sentry.captureException(error, {
        tags: tags,
        contexts: {
          operation: {
            name: operation,
          },
        },
      });
      throw error;
    } finally {
      transaction.finish();
    }
  }, []);

  // Track user interactions
  const trackUserAction = useCallback((
    action: string,
    data?: Record<string, any>
  ) => {
    Sentry.addBreadcrumb({
      category: 'user.action',
      message: action,
      data: data,
      level: 'info',
    });
  }, []);

  // Track page views
  const trackPageView = useCallback((
    page: string,
    params?: Record<string, any>
  ) => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page view: ${page}`,
      data: params,
      level: 'info',
    });
  }, []);

  // Set user context
  const setUserContext = useCallback((
    user: {
      id: string;
      email?: string;
      role?: string;
      username?: string;
    }
  ) => {
    Sentry.setUser(user);
  }, []);

  // Clear user context (for logout)
  const clearUserContext = useCallback(() => {
    Sentry.setUser(null);
  }, []);

  return {
    traceApiCall,
    trackUserAction,
    trackPageView,
    setUserContext,
    clearUserContext,
  };
} 