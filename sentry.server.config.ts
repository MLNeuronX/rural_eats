// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5a9fbc04b63b223d58be8ddc16bd18f5@o4509585371693056.ingest.de.sentry.io/4509586015191120",

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for development
  profilesSampleRate: 1.0, // Enable profiling

  // Debug mode for development
  debug: false,

  // Environment
  environment: process.env.NODE_ENV,

  // Before send function to filter out certain errors
  beforeSend(event, hint) {
    // Don't send errors from localhost in production
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'production') {
      return null;
    }
    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    // Ignore common server errors
    'Non-Error promise rejection captured',
    'ECONNRESET',
    'ENOTFOUND',
  ],
});
