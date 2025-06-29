"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, DollarSign, Package, Truck, CheckCircle } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { showToast } from "@/components/ui/toast-provider"
import { authFetch } from "@/lib/utils"

interface AvailableOrder {
  id: string
  vendor_name: string
  vendor_address: string
  delivery_address: string
  total_amount: number
  delivery_fee: number
  estimated_earnings: number
  created_at: string
  items_count: number
}

interface AssignedOrder {
  id: string
  status: string
  vendor_name: string
  delivery_address: string
  total_amount: number
  delivery_fee: number
  created_at: string
  estimated_earnings: number
}

export default function DriverOrdersPage() {
  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>([])
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState<string | null>(null)

  useEffect(() => {
      loadOrders()
    
    // Set up polling for real-time updates
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    try {
      // Load available orders
      const availableResponse = await authFetch('/api/order/driver/available-orders')
      if (availableResponse.ok) {
        const availableData = await availableResponse.json()
        setAvailableOrders(availableData.orders)
      }

      // Load assigned orders
      const assignedResponse = await authFetch('/api/order/driver/orders')
      if (assignedResponse.ok) {
        const assignedData = await assignedResponse.json()
        setAssignedOrders(assignedData.orders)
      }
    } catch (error) {
      showToast('error', 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const acceptOrder = async (orderId: string) => {
    setIsAccepting(orderId)
    
    try {
      const response = await authFetch(`/api/order/driver/accept-order/${orderId}`, {
        method: 'POST',
      })

      if (response.ok) {
        showToast('success', 'Order accepted successfully!')
        loadOrders() // Refresh orders
      } else {
        const error = await response.json()
        showToast('error', error.error || 'Failed to accept order')
      }
    } catch (error) {
      showToast('error', 'Network error. Please try again.')
    } finally {
      setIsAccepting(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      assigned: { label: "Assigned", className: "bg-blue-100 text-blue-800" },
      out_for_delivery: { label: "Out for Delivery", className: "bg-orange-100 text-orange-800" },
      delivered: { label: "Delivered", className: "bg-green-100 text-green-800" },
    }

    const { label, className } = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={className}>{label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage your deliveries</p>
    </div>

      {/* Available Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Orders</h2>
          <Button onClick={loadOrders} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {availableOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No available orders</p>
              <p className="text-muted-foreground">Check back later for new delivery opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.vendor_name}</CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-xs text-muted-foreground">{order.vendor_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Delivery</p>
                        <p className="text-xs text-muted-foreground">{order.delivery_address}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Order Total:</span>
                      <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee:</span>
                      <span className="font-medium text-green-600">${order.delivery_fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Your Earnings:</span>
                      <span className="text-green-600">${order.estimated_earnings.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{order.items_count} items</span>
                    <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                  </div>

                  <Button 
                    onClick={() => acceptOrder(order.id)}
                    disabled={isAccepting === order.id}
                    className="w-full"
                  >
                    {isAccepting === order.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Truck className="h-4 w-4 mr-2" />
                        Accept Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Active Orders</h2>

        {assignedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No active orders</p>
              <p className="text-muted-foreground">Accept an order from above to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignedOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.vendor_name}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Delivery Address</p>
                        <p className="text-xs text-muted-foreground">{order.delivery_address}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Order Total:</span>
                      <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Your Earnings:</span>
                      <span className="font-medium text-green-600">${order.estimated_earnings.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Order #{order.id.slice(0, 8)}</span>
                    <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                  </div>

                  <Link href={`/driver/orders/${order.id}`}>
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
