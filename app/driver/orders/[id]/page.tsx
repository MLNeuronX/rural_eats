"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, MapPin, Navigation, MessageCircle, Truck, CheckCircle, Clock, Phone } from "lucide-react"
import { getOrderById, updateOrderStatus, type Order } from "@/lib/data"

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusMap: Record<Order["status"], { label: string; className: string }> = {
    NEW: { label: "New", className: "bg-blue-100 text-blue-800" },
    CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-800" },
    PREPARING: { label: "Preparing", className: "bg-yellow-100 text-yellow-800" },
    READY: { label: "Ready", className: "bg-purple-100 text-purple-800" },
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
  const { toast } = useToast()

  useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order)
      setIsLoading(false)
    })
  }, [params.id])

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return

    setIsUpdating(true)
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus, "d1")
      if (updatedOrder) {
        setOrder(updatedOrder)
        toast({
          title: "Status updated",
          description: `Order status changed to ${newStatus.toLowerCase().replace("_", " ")}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
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
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/driver/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const nextAction = getNextAction(order.status)
  const estimatedEarnings = order.deliveryFee * 0.8

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/driver/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Earnings Card */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Delivery Earnings</p>
              <p className="text-2xl font-bold text-green-800">${estimatedEarnings.toFixed(2)}</p>
            </div>
            <div className="text-right text-sm text-green-600">
              <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
              <p>Your Share: 80%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {nextAction && (
          <Button onClick={() => handleStatusUpdate(nextAction.status)} disabled={isUpdating} className="sm:col-span-2">
            <nextAction.icon className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : nextAction.label}
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pickup & Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Pickup Location</p>
              <p className="text-sm text-muted-foreground">Mary's Diner</p>
              <p className="text-sm text-muted-foreground">123 Main St, Rural Town</p>
              <p className="text-xs text-muted-foreground mt-1">Restaurant • (555) 123-4567</p>
            </div>
            <a href={generateMapsLink("123 Main St, Rural Town")} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4 mr-1" />
                Navigate
              </Button>
            </a>
          </div>

          <div className="flex items-start gap-3 p-3 border rounded-lg border-red-200">
            <MapPin className="h-5 w-5 mt-0.5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium">Delivery Location</p>
              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              {order.deliveryTime && (
                <p className="text-xs text-muted-foreground mt-1">Requested time: {order.deliveryTime}</p>
              )}
            </div>
            <a href={generateMapsLink(order.deliveryAddress)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4 mr-1" />
                Navigate
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span className="font-medium">
                  {item.quantity}x {item.name}
                </span>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${(order.total - order.deliveryFee).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${order.deliveryFee.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">Order Placed</p>
                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {order.status !== "NEW" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Order Confirmed</p>
                  <p className="text-xs text-muted-foreground">By restaurant</p>
                </div>
              </div>
            )}

            {["PREPARING", "READY", "ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Food Prepared</p>
                  <p className="text-xs text-muted-foreground">Ready for pickup</p>
                </div>
              </div>
            )}

            {["ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Driver Assigned</p>
                  <p className="text-xs text-muted-foreground">You accepted this order</p>
                </div>
              </div>
            )}

            {["OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div>
                  <p className="text-sm font-medium">Out for Delivery</p>
                  <p className="text-xs text-muted-foreground">On the way to customer</p>
                </div>
              </div>
            )}

            {order.status === "DELIVERED" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Delivered</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
