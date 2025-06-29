"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X, Truck, CheckCircle, Clock, Package } from "lucide-react"
import { realtimeService, type RealtimeNotification } from "@/lib/realtime"
import { showToast } from "@/components/ui/toast-provider"

interface RealtimeNotificationsProps {
  vendorId: string
}

export function RealtimeNotifications({ vendorId }: RealtimeNotificationsProps) {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Subscribe to all relevant notification types
    const unsubscribeDriverAssigned = realtimeService.subscribe('driver_assigned', (notification) => {
      addNotification(notification)
    })

    const unsubscribeDriverAccepted = realtimeService.subscribe('driver_accepted', (notification) => {
      addNotification(notification)
    })

    const unsubscribeOrderAccepted = realtimeService.subscribe('order_accepted', (notification) => {
      addNotification(notification)
    })

    const unsubscribeReadyForPickup = realtimeService.subscribe('ready_for_pickup', (notification) => {
      addNotification(notification)
    })

    return () => {
      unsubscribeDriverAssigned()
      unsubscribeDriverAccepted()
      unsubscribeOrderAccepted()
      unsubscribeReadyForPickup()
    }
  }, [])

  const addNotification = (notification: RealtimeNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Keep only last 5 notifications
  }

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const getNotificationIcon = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'driver_assigned':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'driver_accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'order_accepted':
        return <Package className="h-4 w-4 text-purple-600" />
      case 'ready_for_pickup':
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationBadgeColor = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'driver_assigned':
        return 'bg-blue-100 text-blue-800'
      case 'driver_accepted':
        return 'bg-green-100 text-green-800'
      case 'order_accepted':
        return 'bg-purple-100 text-purple-800'
      case 'ready_for_pickup':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Real-time Updates
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-start gap-3 flex-1">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getNotificationBadgeColor(notification.type)}>
                    {notification.title}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Order #{notification.orderId.slice(0, 8)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 