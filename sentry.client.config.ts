// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5a9fbc04b63b223d58be8ddc16bd18f5@o4509585371693056.ingest.de.sentry.io/4509586015191120",

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for development
  replaysSessionSampleRate: 0.1, // Record 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Record 100% of sessions with errors

  // Enable automatic instrumentation of React components
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  // Enable automatic instrumentation of fetch requests
  autoInstrumentServerFunctions: true,
  autoInstrumentMiddleware: true,

  // Debug mode for development
  debug: false,

  // Environment
  environment: process.env.NODE_ENV,

  // Before send function to filter out certain errors
  beforeSend(event, hint) {
    // Don't send errors from localhost in production
    if (process.env.NODE_ENV === 'production' && window.location.hostname === 'localhost') {
      return null;
    }
    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    // Ignore network errors that are likely temporary
    'Network Error',
    'Failed to fetch',
    // Ignore common browser errors
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
}); 