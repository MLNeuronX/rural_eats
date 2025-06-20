"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Navigation } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getOrdersByDriver, getReadyOrders, type Order } from "@/lib/data"

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

function OrderCard({ order, showActions = false }: { order: Order; showActions?: boolean }) {
  const generateMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  const estimatedEarnings = order.deliveryFee * 0.8

  const timeAgo = (date: string) => {
    const now = new Date()
    const orderDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    return orderDate.toLocaleDateString()
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">Order #{order.id}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""} • ${order.total.toFixed(2)} •{" "}
              {timeAgo(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-green-600">${estimatedEarnings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Earnings</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-xs text-muted-foreground">123 Main St, Rural Town</p>
            </div>
            <a href={generateMapsLink("123 Main St, Rural Town")} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Navigation className="h-3 w-3" />
              </Button>
            </a>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Delivery</p>
              <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
            </div>
            <a href={generateMapsLink(order.deliveryAddress)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Navigation className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/driver/orders/${order.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function OrdersList({ status }: { status?: "available" | "assigned" | "delivered" }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, status])

  const loadOrders = async () => {
    try {
      let ordersData: Order[] = []

      if (status === "available") {
        ordersData = await getReadyOrders()
      } else {
        const driverOrders = await getOrdersByDriver("d1") // Mock driver ID

        if (status === "assigned") {
          ordersData = driverOrders.filter((order) => ["ASSIGNED", "OUT_FOR_DELIVERY"].includes(order.status))
        } else if (status === "delivered") {
          ordersData = driverOrders.filter((order) => order.status === "DELIVERED")
        } else {
          ordersData = driverOrders
        }
      }

      setOrders(ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-28" />
                  </div>
                  <div className="h-8 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (orders.length === 0) {
    const emptyMessages = {
      available: "No orders available for pickup",
      assigned: "No active deliveries",
      delivered: "No completed deliveries",
      default: "No orders found",
    }

    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessages[status || "default"]}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} showActions={status === "available"} />
      ))}
    </div>
  )
}

export default function DriverOrdersPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/driver">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage your delivery orders</p>
        </div>
      </div>

      <Tabs defaultValue="available">
        <TabsList className="w-full">
          <TabsTrigger value="available" className="flex-1">
            Available
          </TabsTrigger>
          <TabsTrigger value="assigned" className="flex-1">
            My Orders
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex-1">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-4">
          <OrdersList status="available" />
        </TabsContent>

        <TabsContent value="assigned" className="mt-4">
          <OrdersList status="assigned" />
        </TabsContent>

        <TabsContent value="delivered" className="mt-4">
          <OrdersList status="delivered" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
