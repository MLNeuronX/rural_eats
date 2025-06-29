"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, MapPin, MessageCircle, CheckCircle, ChefHat, Package, Truck, Printer } from "lucide-react"
import { getOrderById, updateOrderStatus, type Order, vendorAcceptOrder } from "@/lib/data"
import { AssignDriverDialog } from "@/components/vendor/assign-driver-dialog"
import { AutoAssignButton } from "@/components/vendor/auto-assign-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { orderToasts, showToast } from "@/components/ui/toast-provider"
import { useOrderUpdates } from "@/hooks/use-realtime"
import { realtimeService, sendDriverAssignedNotification, sendDriverAcceptedNotification, sendOrderAcceptedNotification, sendReadyForPickupNotification } from "@/lib/realtime"
import { printKitchenOrder } from "@/lib/kitchen-printer"
import { authFetch } from "@/lib/utils"

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
  const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }
  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
}

// Real kitchen printer integration
async function printKitchenTicket(order: Order) {
  try {
    // Use the real kitchen printer service
    const success = await printKitchenOrder({
      id: order.id,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress,
      customerName: 'Customer', // Use default since customerName doesn't exist in Order
      vendorName: 'Restaurant', // This would come from vendor data
      customerPhone: undefined, // This property doesn't exist in Order
      specialInstructions: undefined, // This property doesn't exist in Order
      vendorAddress: 'Restaurant Address'
    })
    
    if (success) {
      showToast('success', 'Kitchen ticket printed successfully!')
    } else {
      showToast('error', 'Failed to print kitchen ticket')
    }
    
    return success
  } catch (error) {
    console.error('Kitchen printer error:', error)
    showToast('error', 'Failed to print kitchen ticket')
    return false
  }
}

// Real-time customer notification
function notifyCustomer(message: string, orderId: string) {
  // Send real-time notification to customer
  sendOrderAcceptedNotification(orderId)
  console.log('Customer notification sent:', message)
}

// Real-time driver notification
function notifyDriver(message: string, orderId: string) {
  // Send real-time notification to driver
  sendReadyForPickupNotification(orderId, 'Vendor')
  console.log('Driver notification sent:', message)
}

export default function VendorOrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [assignDriverDialog, setAssignDriverDialog] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  // Real-time order updates
  const { order: realtimeOrder, isLoading: realtimeLoading } = useOrderUpdates(params.id, true)

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribeDriverAssigned = realtimeService.subscribe('driver_assigned', (notification) => {
      if (notification.orderId === params.id) {
        showToast('success', `Driver ${notification.data?.driverName} assigned to order!`)
      }
    })

    const unsubscribeDriverAccepted = realtimeService.subscribe('driver_accepted', (notification) => {
      if (notification.orderId === params.id) {
        showToast('success', `Driver ${notification.data?.driverName} accepted delivery!`)
        // Enable the "Accept Order & Print" button
        setOrder(prev => prev ? { ...prev, status: 'DRIVER_ACCEPTED' as any } : null)
      }
    })

    const unsubscribeOrderAccepted = realtimeService.subscribe('order_accepted', (notification) => {
      if (notification.orderId === params.id) {
        showToast('success', 'Order accepted and kitchen notified!')
      }
    })

    return () => {
      unsubscribeDriverAssigned()
      unsubscribeDriverAccepted()
      unsubscribeOrderAccepted()
    }
  }, [params.id])

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
      showToast('error', "Failed to load order details")
      setIsLoading(false)
    })
  }, [params.id])

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
      const response = await authFetch(`${baseApiUrl}/api/vendor/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local order state
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
        
        // Send real-time notifications based on status
        if (newStatus === 'PREPARING') {
          notifyCustomer("Your food is being prepared!", order.id);
        } else if (newStatus === 'READY') {
          notifyDriver("Order is ready for pickup!", order.id);
        }
        
        orderToasts.statusUpdated(newStatus);
      } else {
        const error = await response.json();
        showToast('error', error.error || "Failed to update order status");
      }
    } catch (error) {
      showToast('error', "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignDriver = async (driverId: string, driverName: string) => {
    if (!order) return;
    
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
      const response = await authFetch(`${baseApiUrl}/api/vendor/orders/${order.id}/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driver_id: driverId })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local order state
        setOrder(prev => prev ? { 
          ...prev, 
          driverId: driverId,
          status: 'DRIVER_ASSIGNED' as any,
          driver_assigned: true
        } : null)
        
        orderToasts.driverAssigned(driverName);
        
        // Send real-time notification to driver
        sendDriverAssignedNotification(order.id, driverId, driverName);
      } else {
        const error = await response.json();
        showToast('error', error.error || "Failed to assign driver");
      }
    } catch (error) {
      showToast('error', "Failed to assign driver");
    }
  };

  const handleAcceptOrder = async () => {
    if (!order || !order.driverId) {
      showToast('error', "Assign a driver before accepting the order.");
      return;
    }
    setIsAccepting(true)
    try {
      // Call the real backend endpoint
      const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
      const response = await authFetch(`${baseApiUrl}/api/vendor/orders/${order.id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        // Print kitchen ticket
        await printKitchenTicket(order)
        
        // Send real-time notifications
        notifyCustomer("Your food is being prepared!", order.id)
        notifyDriver("Pickup ready at vendor.", order.id)
        
        // Update local order state
        setOrder(prev => prev ? { ...prev, status: 'ACCEPTED' as any } : null)
        
        showToast('success', "Order accepted and sent to kitchen!")
      } else {
        const error = await response.json();
        showToast('error', error.error || "Failed to accept order")
      }
    } catch (error) {
      showToast('error', "Failed to accept order")
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

  // Normalize status: treat 'pending' as 'NEW'
  const normalizedStatus = (order.status === 'pending' ? 'NEW' : order.status) as Order["status"];
  const nextAction = getNextAction(normalizedStatus);

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
            <h1 className="text-2xl font-bold">Order #{typeof order.id === 'string' ? order.id.slice(0, 8) : ''}</h1>
            <p className="text-muted-foreground">Order Details</p>
          </div>
        </div>
        <OrderStatusBadge status={normalizedStatus} />
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
                <p className="font-medium">${typeof item.price === 'number' && typeof item.quantity === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00'}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</span>
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
              <span>${typeof order.total === 'number' && typeof order.deliveryFee === 'number' ? (order.total - order.deliveryFee).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${typeof order.deliveryFee === 'number' ? order.deliveryFee.toFixed(2) : '0.00'}</span>
            </div>
            {order.tip && (
              <div className="flex justify-between">
                <span>Tip</span>
                <span>${typeof order.tip === 'number' ? order.tip.toFixed(2) : '0.00'}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Driver Dialog */}
      <AssignDriverDialog
        open={assignDriverDialog}
        onOpenChange={setAssignDriverDialog}
        orderId={typeof order.id === 'string' ? order.id : ''}
        onDriverAssigned={handleAssignDriver}
      />
    </div>
  )
}
