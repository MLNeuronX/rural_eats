# Sentry Tracing Setup Guide

This guide explains how to use Sentry tracing and error monitoring in your Rural Eats frontend application.

## What's Already Set Up

### 1. **Configuration Files**
- `sentry.client.config.ts` - Client-side Sentry configuration
- `sentry.server.config.ts` - Server-side Sentry configuration  
- `sentry.edge.config.ts` - Edge runtime Sentry configuration

### 2. **Automatic Tracking**
- **Page Views**: Automatically tracked via `PageTracker` component in layout
- **Authentication**: Login/logout events tracked in `AuthProvider`
- **User Context**: Automatically set when users log in/out

### 3. **Utilities**
- `lib/sentry-tracing.ts` - Helper functions for manual tracking
- `hooks/use-sentry-tracing.ts` - React hook for tracing (advanced usage)

## How to Use Sentry Tracing

### 1. **Track API Calls**

Use the `traceApiCall` utility to wrap your API calls:

```typescript
import { traceApiCall } from '@/lib/sentry-tracing'

// Instead of this:
const response = await fetch('/api/orders')

// Do this:
const response = await traceApiCall(
  'fetch-orders',
  () => fetch('/api/orders'),
  { userRole: 'vendor' }
)
```

### 2. **Track User Actions**

```typescript
import { trackUserAction } from '@/lib/sentry-tracing'

// Track button clicks, form submissions, etc.
trackUserAction('add-to-cart', { 
  productId: '123', 
  quantity: 2 
})
```

### 3. **Track Form Submissions**

```typescript
import { trackFormSubmission } from '@/lib/sentry-tracing'

try {
  await submitForm(data)
  trackFormSubmission('vendor-profile', true, { 
    hasLogo: !!data.logo 
  })
} catch (error) {
  trackFormSubmission('vendor-profile', false, { 
    error: error.message 
  })
  throw error
}
```

### 4. **Track Errors Manually**

```typescript
import { trackError } from '@/lib/sentry-tracing'

try {
  // Your code here
} catch (error) {
  trackError(error, {
    component: 'OrderList',
    userId: user.id,
    orderId: orderId
  })
}
```

### 5. **Set Custom Context**

```typescript
import { setPageContext } from '@/lib/sentry-tracing'

// Set page-specific context
setPageContext({
  pathname: '/vendor/orders',
  search: '?status=pending',
  url: window.location.href
})
```

## What Gets Tracked Automatically

### ✅ **Already Working**
- Page navigation (via `PageTracker`)
- Login/logout events (via `AuthProvider`)
- User context (ID, email, role)
- Page context (URL, pathname, search params)
- All uncaught JavaScript errors
- Performance metrics (LCP, FID, CLS)

### 🔧 **Manual Tracking Needed**
- API call success/failure
- Form submissions
- Button clicks
- Business logic errors
- Custom user actions

## Sentry Dashboard Features

### 1. **Performance Monitoring**
- View slow transactions
- Identify bottlenecks
- Track API response times

### 2. **Error Tracking**
- Real-time error alerts
- Error grouping and trends
- Stack traces with context

### 3. **User Journey**
- Breadcrumb trail for each error
- User actions leading to errors
- Page navigation history

### 4. **Releases**
- Track errors by version
- Monitor deployment impact
- Performance regression detection

## Best Practices

### 1. **Use Descriptive Operation Names**
```typescript
// Good
traceApiCall('fetch-vendor-orders', apiCall)

// Bad
traceApiCall('api', apiCall)
```

### 2. **Add Relevant Tags**
```typescript
traceApiCall('fetch-orders', apiCall, {
  userRole: 'vendor',
  orderStatus: 'pending',
  page: 'vendor-dashboard'
})
```

### 3. **Don't Over-Track**
- Focus on important user actions
- Track errors that need investigation
- Avoid tracking every click

### 4. **Use Breadcrumbs for Context**
```typescript
// Add breadcrumbs before important operations
Sentry.addBreadcrumb({
  category: 'user.action',
  message: 'User clicked checkout button',
  level: 'info',
  data: { cartItems: 3, total: 45.99 }
})
```

## Environment Configuration

### Development
- `tracesSampleRate: 1.0` - Capture all transactions
- `debug: false` - Disable debug logging
- Errors sent to Sentry for testing

### Production
- `tracesSampleRate: 0.1` - Capture 10% of transactions
- `debug: false` - Disable debug logging
- Full error monitoring and performance tracking

## Troubleshooting

### 1. **Errors Not Appearing in Sentry**
- Check DSN configuration
- Verify network connectivity
- Check browser console for Sentry errors

### 2. **Performance Data Missing**
- Ensure `tracesSampleRate > 0`
- Check if transactions are being created
- Verify page load timing

### 3. **Too Many Errors**
- Adjust `ignoreErrors` in config
- Use `beforeSend` to filter events
- Set appropriate sampling rates

## Next Steps

1. **Start with API calls** - Wrap your most important API calls with `traceApiCall`
2. **Add form tracking** - Track form submissions and failures
3. **Monitor user flows** - Track key user journeys
4. **Set up alerts** - Configure Sentry alerts for critical errors
5. **Review performance** - Use Sentry performance data to optimize your app

## Useful Sentry Queries

### Find API Errors
```
category:api AND level:error
```

### Find Slow Transactions
```
transaction.duration:>2000
```

### Find User-Specific Errors
```
user.id:"your-user-id"
```

### Find Recent Errors
```
timestamp:>now-24h
``` 