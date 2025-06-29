"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react"
import { getOrderById } from "@/lib/data"

function OrderStatusTimeline({ status }: { status: string }) {
  // Add all possible statuses from backend
  const statuses: string[] = [
    "NEW", "CONFIRMED", "PREPARING", "READY", "DRIVER_ASSIGNED", "DRIVER_ACCEPTED", "ACCEPTED", "ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED"
  ];

  const statusLabels: Record<string, string> = {
    NEW: "Order Placed",
    CONFIRMED: "Order Confirmed",
    PREPARING: "Preparing Food",
    READY: "Ready for Pickup",
    DRIVER_ASSIGNED: "Driver Assigned",
    DRIVER_ACCEPTED: "Driver Accepted",
    ACCEPTED: "Accepted",
    ASSIGNED: "Assigned",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  };

  const currentIndex = statuses.indexOf(status);

  return (
    <div className="space-y-4">
      {statuses.map((s, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isCompleted ? (isCurrent ? "bg-primary" : "bg-green-500") : "bg-muted"
              }`}
            />
            <span className={`text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
              {statusLabels[s] || s}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const whatsappLink = searchParams.get("whatsapp")

  useEffect(() => {
    getOrderById(params.id).then((res) => {
      if (res && res.order) {
        setOrder(res.order)
        setItems(res.items || [])
      }
      setIsLoading(false)
    })
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/buyer/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  // Defensive helpers
  const total = order.total_amount || 0
  const deliveryFee = order.delivery_fee || 0
  const subtotal = total - deliveryFee

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/buyer/orders">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      </div>

      {whatsappLink && (
        <Card className="mb-4 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Contact Restaurant</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Your order has been placed! Contact the restaurant for updates.
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Message on WhatsApp
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline status={order.status} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.quantity}x {item.name || item.menu_item_id}
              </span>
              <span>${((item.price || item.price_at_time || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
            </div>
          </div>

          {order.delivery_time && (
            <div className="mt-3">
              <p className="font-medium">Requested Time</p>
              <p className="text-sm text-muted-foreground">{order.delivery_time}</p>
            </div>
          )}

          <div className="mt-3">
            <p className="font-medium">Order Placed</p>
            <p className="text-sm text-muted-foreground">
              {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""} at{" "}
              {order.created_at ? new Date(order.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
