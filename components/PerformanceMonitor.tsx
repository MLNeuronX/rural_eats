"use client"

import { useEffect } from 'react'

const PerformanceMonitor = () => {
  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
        
        // Send to analytics if needed
        if (lastEntry.startTime > 2500) {
          console.warn('LCP is poor:', lastEntry.startTime)
        }
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP observer failed:', e)
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
          
          if (fidEntry.processingStart - fidEntry.startTime > 100) {
            console.warn('FID is poor:', fidEntry.processingStart - fidEntry.startTime)
          }
        })
      })
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID observer failed:', e)
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          const layoutEntry = entry as any
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value
          }
        })
        
        console.log('CLS:', clsValue)
        
        if (clsValue > 0.1) {
          console.warn('CLS is poor:', clsValue)
        }
      })
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS observer failed:', e)
      }
    }

    // Track page load performance
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (navigation) {
            console.log('Page Load Time:', navigation.loadEventEnd - navigation.loadEventStart)
            console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
            console.log('First Paint:', performance.getEntriesByName('first-paint')[0]?.startTime)
            console.log('First Contentful Paint:', performance.getEntriesByName('first-contentful-paint')[0]?.startTime)
          }
        }, 0)
      })
    }
  }, [])

  return null
}

export default PerformanceMonitor 