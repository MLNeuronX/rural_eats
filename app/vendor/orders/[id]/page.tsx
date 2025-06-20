"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Clock, MapPin, MessageCircle, CheckCircle, ChefHat, Package, Truck } from "lucide-react"
import { getOrderById, updateOrderStatus, type Order } from "@/lib/data"
import { AssignDriverDialog } from "@/components/vendor/assign-driver-dialog"

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

export default function VendorOrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const [assignDriverDialog, setAssignDriverDialog] = useState(false)

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
      const updatedOrder = await updateOrderStatus(order.id, newStatus)
      if (updatedOrder) {
        setOrder(updatedOrder)
        toast({
          title: "Order updated",
          description: `Order status changed to ${newStatus.toLowerCase()}.`,
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

  const handleDriverAssigned = async (driverId: string, driverName: string) => {
    try {
      const updatedOrder = await updateOrderStatus(order.id, "ASSIGNED", driverId)
      if (updatedOrder) {
        setOrder(updatedOrder)
        toast({
          title: "Driver Assigned & Buyer Notified! 🚚📱",
          description: `${driverName} will handle the delivery. Customer has been notified.`,
          className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign driver",
        variant: "destructive",
      })
    }
  }

  const getNextAction = (status: Order["status"]) => {
    switch (status) {
      case "NEW":
        return { status: "CONFIRMED" as const, label: "Confirm Order", icon: CheckCircle }
      case "CONFIRMED":
        return { status: "PREPARING" as const, label: "Start Preparing", icon: ChefHat }
      case "PREPARING":
        return { status: "READY" as const, label: "Mark as Ready", icon: Package }
      default:
        return null
    }
  }

  const generateWhatsAppLink = (type: "buyer" | "driver") => {
    if (!order) return ""

    const message =
      type === "buyer"
        ? `Hi! This is regarding your order #${order.id}. Your order status is: ${order.status}.`
        : `Hi! I need to discuss order #${order.id} for pickup/delivery.`

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
        <Link href="/vendor/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const nextAction = getNextAction(order.status)

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/vendor/orders">
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

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        {nextAction && (
          <Button onClick={() => handleStatusUpdate(nextAction.status)} disabled={isUpdating} className="flex-1">
            <nextAction.icon className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : nextAction.label}
          </Button>
        )}

        {order.status === "READY" && !order.driverId && (
          <Button onClick={() => setAssignDriverDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Truck className="h-4 w-4 mr-2" />
            Assign Driver
          </Button>
        )}

        <a href={generateWhatsAppLink("buyer")} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Buyer
          </Button>
        </a>

        {order.driverId && (
          <a href={generateWhatsAppLink("driver")} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Driver
            </Button>
          </a>
        )}
      </div>

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

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </div>

          {order.deliveryTime && (
            <div>
              <p className="font-medium">Requested Delivery Time</p>
              <p className="text-sm text-muted-foreground">{order.deliveryTime}</p>
            </div>
          )}

          <div>
            <p className="font-medium">Order Placed</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {order.updatedAt !== order.createdAt && (
            <div>
              <p className="font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.updatedAt).toLocaleDateString()} at{" "}
                {new Date(order.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <AssignDriverDialog
        open={assignDriverDialog}
        onOpenChange={setAssignDriverDialog}
        orderId={order.id}
        onDriverAssigned={handleDriverAssigned}
      />
    </div>
  )
}
