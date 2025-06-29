"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Navigation, MessageCircle, Truck, CheckCircle, Clock, Phone, Bell } from "lucide-react"
import { getOrderById, updateOrderStatus, type Order, driverAcceptAssignment } from "@/lib/data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { orderToasts, showToast } from "@/components/ui/toast-provider"
import { useOrderUpdates } from "@/hooks/use-realtime"
import { realtimeService, sendDriverAcceptedNotification } from "@/lib/realtime"
import { useAuth } from "@/components/auth-provider"

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusMap: Record<Order["status"], { label: string; className: string }> = {
    NEW: { label: "New", className: "bg-blue-100 text-blue-800" },
    CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-800" },
    PREPARING: { label: "Preparing", className: "bg-yellow-100 text-yellow-800" },
    READY: { label: "Ready", className: "bg-purple-100 text-purple-800" },
    DRIVER_ASSIGNED: { label: "Driver Assigned", className: "bg-indigo-100 text-indigo-800" },
    DRIVER_ACCEPTED: { label: "Driver Accepted", className: "bg-cyan-100 text-cyan-800" },
    ACCEPTED: { label: "Accepted", className: "bg-green-200 text-green-900" },
    ASSIGNED: { label: "Assigned", className: "bg-indigo-100 text-indigo-800" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", className: "bg-orange-100 text-orange-800" },
    DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-800" },
  }

  const { label, className } = statusMap[status]
  return <Badge className={className}>{label}</Badge>
}

export default function DriverOrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const { user } = useAuth()

  // Real-time order updates
  const { order: realtimeOrder, isLoading: realtimeLoading } = useOrderUpdates(params.id)

  // Update local order when realtime order changes
  useEffect(() => {
    if (realtimeOrder) {
      setOrder(realtimeOrder)
    }
  }, [realtimeOrder])

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribeReadyForPickup = realtimeService.subscribe('ready_for_pickup', (notification) => {
      if (notification.orderId === params.id) {
        showToast('warning', 'Order is ready for pickup!')
      }
    })

    const unsubscribeOrderAccepted = realtimeService.subscribe('order_accepted', (notification) => {
      if (notification.orderId === params.id) {
        showToast('info', 'Vendor has accepted the order and is preparing it')
      }
    })

    return () => {
      unsubscribeReadyForPickup()
      unsubscribeOrderAccepted()
    }
  }, [params.id])

  useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order)
      setIsLoading(false)
    }).catch((error) => {
      showToast('error', "Failed to load order details")
      setIsLoading(false)
    })
  }, [params.id])

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return

    setIsUpdating(true)
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus)
      if (updatedOrder) {
        setOrder(updatedOrder)
        orderToasts.statusUpdated(newStatus)
        
        if (newStatus === "DELIVERED") {
          orderToasts.orderDelivered()
        }
      }
    } catch (error) {
      showToast('error', "Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAcceptDelivery = async () => {
    if (!order) return
    setIsAccepting(true)
    try {
      await driverAcceptAssignment(order.id)
      
      // Send real-time notification
      sendDriverAcceptedNotification(order.id, 'Driver')
      
      showToast('success', "Delivery assignment accepted!")
      
      // Update local state to reflect the change
      setOrder(prev => prev ? { ...prev, status: 'DRIVER_ACCEPTED' as any } : null)
      
    } catch (error) {
      showToast('error', "Failed to accept delivery assignment")
    } finally {
      setIsAccepting(false)
    }
  }

  const getNextAction = (status: Order["status"]) => {
    switch (status) {
      case "ASSIGNED":
        return { status: "OUT_FOR_DELIVERY" as const, label: "Start Delivery", icon: Truck }
      case "OUT_FOR_DELIVERY":
        return { status: "DELIVERED" as const, label: "Mark as Delivered", icon: CheckCircle }
      default:
        return null
    }
  }

  const generateMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  const generateWhatsAppLink = (type: "vendor" | "buyer") => {
    if (!order) return ""

    const message =
      type === "vendor"
        ? `Hi! I'm the driver for order #${order.id}. I'm ready for pickup.`
        : `Hi! I'm your delivery driver for order #${order.id}. I'm on my way!`

    return `https://wa.me/15551234567?text=${encodeURIComponent(message)}`
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <LoadingSpinner size="lg" text="Loading order details..." />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
          <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist.</p>
          <Link href="/driver/orders">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const nextAction = getNextAction(order.status)

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/driver/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground">Delivery Details</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {nextAction && (
          <Button onClick={() => handleStatusUpdate(nextAction.status)} disabled={isUpdating} className="sm:col-span-2">
            <nextAction.icon className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : nextAction.label}
          </Button>
        )}
        {order.status === "DRIVER_ASSIGNED" && (
          <Button onClick={handleAcceptDelivery} disabled={isAccepting} className="bg-emerald-700 hover:bg-emerald-800 sm:col-span-2">
            {isAccepting ? "Accepting..." : "Accept Delivery"}
          </Button>
        )}

        <a href={generateWhatsAppLink("vendor")} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Vendor
          </Button>
        </a>

        <a href={generateWhatsAppLink("buyer")} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Customer
          </Button>
        </a>

        <a href="tel:+15551234567">
          <Button variant="outline" className="w-full">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
        </a>
      </div>

      {/* Pickup and Delivery Locations */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Restaurant Address</p>
                <p className="text-sm text-muted-foreground">123 Main St, Rural Town</p>
              </div>
            </div>
            <a
              href={generateMapsLink("123 Main St, Rural Town")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Customer Address</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
            <a
              href={generateMapsLink(order.deliveryAddress)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Order Time</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {order.deliveryTime && (
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryTime}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Order Total</span>
              <span>${(order.total - order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            {order.tip && (
              <div className="flex justify-between">
                <span>Tip</span>
                <span>${order.tip.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Your Earnings</span>
              <span>${(order.deliveryFee + (order.tip || 0)).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
