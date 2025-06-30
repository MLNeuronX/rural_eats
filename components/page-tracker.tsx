"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'

interface PageTrackerProps {
  children: React.ReactNode
}

export function PageTracker({ children }: PageTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view with Sentry
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page view: ${pathname}`,
      level: 'info',
      data: {
        pathname,
        search: searchParams.toString(),
        url: window.location.href,
      },
    })

    // Set page context for better error tracking
    Sentry.setContext('page', {
      pathname,
      search: searchParams.toString(),
      url: window.location.href,
    })
  }, [pathname, searchParams])

  return <>{children}</>
} 