import { useEffect, useRef, useState } from "react"
import { showToast } from "@/components/ui/toast-provider"

interface UseRealtimeOptions {
  interval?: number
  enabled?: boolean
  onUpdate?: (data: any) => void
  onError?: (error: Error) => void
}

export function useRealtime<T>(
  fetchFn: () => Promise<T>,
  options: UseRealtimeOptions = {}
) {
  const { interval = 5000, enabled = true, onUpdate, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<T | null>(null)

  const fetchData = async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)

      // Check if data has changed and trigger update callback
      if (lastDataRef.current !== null && JSON.stringify(lastDataRef.current) !== JSON.stringify(result)) {
        onUpdate?.(result)
      }

      lastDataRef.current = result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error")
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchData()

    // Set up polling interval
    if (enabled) {
      intervalRef.current = setInterval(fetchData, interval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval])

  return { data, isLoading, error, refetch: fetchData }
}

// Specialized hook for order updates
export function useOrderUpdates(orderId: string, enabled = true) {
  const { data: order, isLoading, error } = useRealtime(
    () => fetch(`/api/orders/${orderId}`).then(res => res.json()),
    {
      interval: 3000,
      enabled,
      onUpdate: (updatedOrder) => {
        showToast.info(`Order #${orderId} status updated to ${updatedOrder.status}`)
      },
      onError: (error) => {
        showToast.error(`Failed to update order: ${error.message}`)
      }
    }
  )

  return { order, isLoading, error }
}

// Hook for vendor dashboard updates
export function useVendorDashboardUpdates(vendorId: string, enabled = true) {
  const { data: dashboardData, isLoading, error } = useRealtime(
    () => fetch(`/api/vendor/dashboard/${vendorId}`).then(res => res.json()),
    {
      interval: 10000,
      enabled,
      onUpdate: (data) => {
        if (data.newOrders > 0) {
          showToast.info(`You have ${data.newOrders} new order(s)!`)
        }
      }
    }
  )

  return { dashboardData, isLoading, error }
} 