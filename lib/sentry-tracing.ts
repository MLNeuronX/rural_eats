import * as Sentry from '@sentry/nextjs'

// Track API calls with Sentry
export async function traceApiCall<T>(
  operation: string,
  apiCall: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  // Add breadcrumb for API call start
  Sentry.addBreadcrumb({
    category: 'api',
    message: `API call started: ${operation}`,
    level: 'info',
    data: { operation, tags },
  })

  try {
    const result = await apiCall()
    
    // Add breadcrumb for successful API call
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API call successful: ${operation}`,
      level: 'info',
      data: { operation, tags },
    })
    
    return result
  } catch (error) {
    // Add breadcrumb for failed API call
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API call failed: ${operation}`,
      level: 'error',
      data: { operation, tags, error: error instanceof Error ? error.message : String(error) },
    })
    
    // Capture the error with context
    Sentry.captureException(error, {
      tags: tags,
      contexts: {
        operation: { name: operation },
      },
    })
    
    throw error
  }
}

// Track user actions
export function trackUserAction(
  action: string,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    category: 'user.action',
    message: action,
    level: 'info',
    data: data,
  })
}

// Track form submissions
export function trackFormSubmission(
  formName: string,
  success: boolean,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    category: 'form',
    message: `Form ${success ? 'submitted' : 'failed'}: ${formName}`,
    level: success ? 'info' : 'error',
    data: { formName, success, ...data },
  })
}

// Track errors with context
export function trackError(
  error: Error,
  context?: Record<string, any>
) {
  Sentry.captureException(error, {
    contexts: context,
  })
}

// Set user context
export function setUserContext(user: {
  id: string
  email?: string
  role?: string
  username?: string
}) {
  Sentry.setUser(user)
}

// Clear user context
export function clearUserContext() {
  Sentry.setUser(null)
}

// Set page context
export function setPageContext(page: {
  pathname: string
  search?: string
  url?: string
}) {
  Sentry.setContext('page', page)
} 