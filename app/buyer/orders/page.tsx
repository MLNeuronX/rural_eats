"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { getOrdersByBuyer, type Order } from "@/lib/data"

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

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/buyer/orders/${order.id}`}>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Order #{order.id}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="space-y-1 mb-3">
            {order.items.map((item, index) => (
              <p key={index} className="text-sm">
                {item.quantity}x {item.name}
              </p>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">${order.total.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function OrdersList({ status }: { status?: Order["status"] }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      getOrdersByBuyer(user.id).then((orders) => {
        const filteredOrders = status ? orders.filter((order) => order.status === status) : orders

        setOrders(filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        setIsLoading(false)
      })
    }
  }, [user, status])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-1 mb-3">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{status ? `No ${status.toLowerCase()} orders` : "No orders yet"}</p>
        <Link href="/buyer">
          <Button>Start Ordering</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <Tabs defaultValue="all">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1">
            Active
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex-1">
            Delivered
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <OrdersList />
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <OrdersList status="PREPARING" />
        </TabsContent>

        <TabsContent value="delivered" className="mt-4">
          <OrdersList status="DELIVERED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
