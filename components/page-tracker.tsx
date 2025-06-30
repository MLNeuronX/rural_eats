"use client"
export const dynamic = "force-dynamic"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface PageTrackerProps {
  children: React.ReactNode
}

export function PageTracker({ children }: PageTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view with Sentry
    // Sentry integration removed for clean build
  }, [pathname, searchParams])

  return <>{children}</>
} 