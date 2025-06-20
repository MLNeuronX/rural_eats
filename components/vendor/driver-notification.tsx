"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Phone, MessageSquare, Bell, Clock, MapPin, User } from "lucide-react"

interface DriverNotificationProps {
  orderId: string
  driverName: string
  driverPhone: string
  estimatedTime: number
  pickupAddress: string
}

export function DriverNotification({
  orderId,
  driverName,
  driverPhone,
  estimatedTime,
  pickupAddress,
}: DriverNotificationProps) {
  const [isNotifying, setIsNotifying] = useState(false)
  const [hasNotified, setHasNotified] = useState(false)
  const { toast } = useToast()

  const notifyDriver = async (method: "call" | "sms" | "app") => {
    setIsNotifying(true)

    try {
      // Simulate API call to notify driver
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let message = ""
      switch (method) {
        case "call":
          message = `Calling ${driverName}...`
          break
        case "sms":
          message = `SMS sent to ${driverName}`
          break
        case "app":
          message = `Push notification sent to ${driverName}`
          break
      }

      toast({
        title: "Driver notified",
        description: message,
      })

      setHasNotified(true)
    } catch (error) {
      toast({
        title: "Failed to notify driver",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsNotifying(false)
    }
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Order Ready for Pickup
        </CardTitle>
        <CardDescription>Order #{orderId} is ready. Notify the assigned driver.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{driverName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{driverPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>ETA: {estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{pickupAddress}</span>
          </div>
        </div>

        {!hasNotified ? (
          <div className="flex gap-2">
            <Button onClick={() => notifyDriver("app")} disabled={isNotifying} className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              {isNotifying ? "Notifying..." : "Notify via App"}
            </Button>
            <Button variant="outline" onClick={() => notifyDriver("sms")} disabled={isNotifying}>
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
            <Button variant="outline" onClick={() => notifyDriver("call")} disabled={isNotifying}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-green-600 font-medium">✓ Driver has been notified</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
