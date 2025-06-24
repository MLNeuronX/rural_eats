"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, MapPin, MessageCircle, CheckCircle, ChefHat, Package, Truck } from "lucide-react"
import { getOrderById, updateOrderStatus, type Order, vendorAcceptOrder } from "@/lib/data"
import { AssignDriverDialog } from "@/components/vendor/assign-driver-dialog"
import { AutoAssignButton } from "@/components/vendor/auto-assign-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { orderToasts, showToast } from "@/components/ui/toast-provider"
import { useOrderUpdates } from "@/hooks/use-realtime"

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

// Placeholder implementations for print and notifications
function printKitchenTicket(order: Order) {
  // TODO: Integrate with actual kitchen printer
  console.log('Printing kitchen ticket for order', order.id);
}
function notifyCustomer(message: string) {
  // TODO: Integrate with actual notification system
  console.log('Notify customer:', message);
}
function notifyDriver(message: string) {
  // TODO: Integrate with actual notification system
  console.log('Notify driver:', message);
}

export default function VendorOrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [assignDriverDialog, setAssignDriverDialog] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  // Real-time order updates
  const { order: realtimeOrder, isLoading: realtimeLoading } = useOrderUpdates(params.id, true)

  useEffect(() => {
    if (realtimeOrder) {
      setOrder(realtimeOrder)
    }
  }, [realtimeOrder])

  useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order)
      setIsLoading(false)
    }).catch((error) => {
      showToast.error("Failed to load order details")
      setIsLoading(false)
    })
  }, [params.id])

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      if (updatedOrder) {
        setOrder(updatedOrder);
        orderToasts.statusUpdated(newStatus);
      }
    } catch (error) {
      showToast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDriverAssigned = async (driverId: string, driverName: string) => {
    if (!order) return;
    
    try {
      const updatedOrder = await updateOrderStatus(order.id, "ASSIGNED", driverId);
      if (updatedOrder) {
        setOrder(updatedOrder);
        orderToasts.driverAssigned(driverName);
      }
    } catch (error) {
      showToast.error("Failed to assign driver");
    }
  };

  const handleAcceptOrder = async () => {
    if (!order || !order.driverId) {
      alert("Assign a driver before accepting the order.");
      return;
    }
    setIsAccepting(true)
    try {
      await vendorAcceptOrder(order.id)
      printKitchenTicket(order)
      notifyCustomer("Your food is being prepared!")
      notifyDriver("Pickup ready at vendor.")
      showToast.success("Order accepted and sent to kitchen!")
      // Optionally refetch order or update state
    } catch (error) {
      showToast.error("Failed to accept order")
    } finally {
      setIsAccepting(false)
    }
  }

  // Helper function to check if vendor can accept order
  const canVendorAcceptOrder = () => {
    return order && order.driver_assigned && order.status === "DRIVER_ACCEPTED"
  }

  // Block vendor from accepting order unless a driver is assigned
  const isDriverAssigned = () => {
    return order && order.driver_assigned
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
          <Link href="/vendor/orders">
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
          <Link href="/vendor/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground">Order Details</p>
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
          <>
            <AutoAssignButton 
              orderId={order.id} 
              onDriverAssigned={(driver) => {
                // Update order with driver info
                setOrder(prev => prev ? { ...prev, driverId: driver.id } : null)
              }}
            />
            <Button onClick={() => setAssignDriverDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Truck className="h-4 w-4 mr-2" />
              Manual Assign
            </Button>
          </>
        )}

        {/* Accept Order & Print button, only enabled if driver assigned and status is DRIVER_ACCEPTED */}
        {canVendorAcceptOrder() ? (
          <Button onClick={handleAcceptOrder} disabled={isAccepting} className="bg-emerald-700 hover:bg-emerald-800">
            {isAccepting ? "Accepting..." : "Accept Order & Print"}
          </Button>
        ) : order.status === "DRIVER_ACCEPTED" && !isDriverAssigned() ? (
          <Button disabled className="bg-gray-400 cursor-not-allowed" title="No driver assigned yet">
            Accept Order & Print
          </Button>
        ) : null}

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
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
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
              <span>Subtotal</span>
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
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Driver Dialog */}
      <AssignDriverDialog
        open={assignDriverDialog}
        onOpenChange={setAssignDriverDialog}
        orderId={order.id}
        onDriverAssigned={handleDriverAssigned}
      />
    </div>
  )
}
