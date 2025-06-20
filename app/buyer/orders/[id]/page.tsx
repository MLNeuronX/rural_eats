"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react"
import { getOrderById, type Order } from "@/lib/data"

function OrderStatusTimeline({ status }: { status: Order["status"] }) {
  const statuses: Order["status"][] = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"]

  const statusLabels: Record<Order["status"], string> = {
    NEW: "Order Placed",
    CONFIRMED: "Order Confirmed",
    PREPARING: "Preparing Food",
    READY: "Ready for Pickup",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  }

  const currentIndex = statuses.indexOf(status)

  return (
    <div className="space-y-4">
      {statuses.map((s, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isCompleted ? (isCurrent ? "bg-primary" : "bg-green-500") : "bg-muted"
              }`}
            />
            <span className={`text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
              {statusLabels[s]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const whatsappLink = searchParams.get("whatsapp")

  useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order)
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
              {order.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                      {item.quantity}x {item.name}
                    </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
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

          <div className="flex justify-between font-medium">
                  <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
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
              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </div>

          {order.deliveryTime && (
            <div className="mt-3">
              <p className="font-medium">Requested Time</p>
              <p className="text-sm text-muted-foreground">{order.deliveryTime}</p>
            </div>
          )}

          <div className="mt-3">
            <p className="font-medium">Order Placed</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
      </div>
        </CardContent>
      </Card>
    </div>
  )
}
