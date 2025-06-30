"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, Eye, Clock, DollarSign, TrendingUp, Package, Plus } from "lucide-react"
import { getOrdersByVendor, type Order } from "@/lib/data"
import { showToast } from "@/components/ui/toast-provider"
import { authFetch } from "@/lib/utils"

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusMap: Record<Order["status"], { label: string; className: string }> = {
    NEW: { label: "New", className: "bg-blue-100 text-blue-800" },
    CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-800" },
    PREPARING: { label: "Preparing", className: "bg-yellow-100 text-yellow-800" },
    READY: { label: "Ready", className: "bg-purple-100 text-purple-800" },
    DRIVER_ASSIGNED: { label: "Driver Assigned", className: "bg-indigo-100 text-indigo-800" },
    DRIVER_ACCEPTED: { label: "Driver Accepted", className: "bg-indigo-100 text-indigo-800" },
    ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-800" },
    ASSIGNED: { label: "Assigned", className: "bg-indigo-100 text-indigo-800" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", className: "bg-orange-100 text-orange-800" },
    DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-800" },
  }

  const { label, className } = statusMap[status]
  return <Badge className={className}>{label}</Badge>
}

function OrderCard({ order }: { order: Order }) {
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
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">Order #{order.id}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{timeAgo(order.createdAt)}</span>
              <span>•</span>
              <span>{Array.isArray(order.items) ? order.items.length : 0} items</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">${order.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          {(Array.isArray(order.items) ? order.items.slice(0, 2) : []).map((item, index) => (
            <p key={index} className="text-sm">
              {item.quantity}x {item.name}
            </p>
          ))}
          {Array.isArray(order.items) && order.items.length > 2 && (
            <p className="text-sm text-muted-foreground">+{order.items.length - 2} more items</p>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          <p>
            <strong>Customer:</strong> {order.buyer?.name || `Buyer #${order.buyerId}`}
          </p>
          <p>
            <strong>Vendor:</strong> {order.vendor?.business_name || `Vendor #${order.vendorId}`}
          </p>
          {order.driverId && (
            <p>
              <strong>Driver:</strong> {order.driver?.name || `Driver #${order.driverId}`}
            </p>
          )}
          <p>
            <strong>Address:</strong> {order.deliveryAddress}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Created: {new Date(order.createdAt).toLocaleString()}</div>
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OrdersList({ status }: { status?: Order["status"] }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [status])

  const loadOrders = async () => {
    try {
      // Implement real API call to get all orders from backend
      const response = await authFetch('/api/admin/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      const allOrders: Order[] = data.orders || []

      let filteredOrders = allOrders
      if (status) {
        filteredOrders = allOrders.filter((order) => order.status === status)
      }

      setOrders(filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("Failed to load orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-40" />
                    <div className="h-3 bg-muted rounded w-36" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted rounded w-48" />
                    <div className="h-8 bg-muted rounded w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {status ? `No ${status.toLowerCase()} orders found` : "No orders found"}
          </p>
        </CardContent>
      </Card>
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
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])

  // Helper to fetch all orders for export (real implementation)
  const fetchAllOrders = async (): Promise<Order[]> => {
    try {
      // Implement real API call to get all orders
      const response = await authFetch('/api/admin/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      return data.orders || []
    } catch (e) {
      console.error('Failed to fetch orders for export:', e)
      return []
    }
  }

  const handleExportOrders = async () => {
    try {
      const allOrders = await fetchAllOrders()
      if (!allOrders.length) {
        showToast.info("No orders to export.")
        return
      }
      // Convert orders to CSV
      const csvRows = [
        [
          "Order ID",
          "Status",
          "Created At",
          "Total",
          "Buyer ID",
          "Vendor ID",
          "Driver ID",
          "Delivery Address",
          "Items"
        ].join(","),
        ...allOrders.map((order: Order) =>
          [
            order.id,
            order.status,
            order.createdAt,
            order.total,
            order.buyerId,
            order.vendorId,
            order.driverId || "",
            '"' + (order.deliveryAddress || "") + '"',
            '"' + (Array.isArray(order.items) ? order.items.map((item: any) => `${item.quantity}x ${item.name}`).join('; ') : '') + '"',
          ].join(",")
        ),
      ]
      const csvContent = csvRows.join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `orders_export_${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast.success("Orders exported as CSV.")
    } catch (e) {
      showToast.error("Failed to export orders.")
    }
  }

  const createTestOrder = async () => {
    try {
      // Use the vendor test order endpoint which automatically uses real UUIDs
      const response = await authFetch('/api/order/vendor/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body, the endpoint handles everything
      })

      if (response.ok) {
        const newOrder = await response.json()
        showToast.success(`Test order created! ID: ${newOrder.order.id}`)
        // Refresh the orders list
        window.location.reload()
      } else {
        const error = await response.text()
        showToast.error(`Failed to create test order: ${error}`)
      }
    } catch (error) {
      console.error('Error creating test order:', error)
      showToast.error('Failed to create test order. Make sure you are logged in as a vendor.')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Monitor all platform orders</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createTestOrder} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Test Order
          </Button>
          <Button onClick={handleExportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, customer, or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="NEW">New</TabsTrigger>
          <TabsTrigger value="PREPARING">Preparing</TabsTrigger>
          <TabsTrigger value="OUT_FOR_DELIVERY">Out for Delivery</TabsTrigger>
          <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OrdersList />
        </TabsContent>

        <TabsContent value="NEW">
          <OrdersList status="NEW" />
        </TabsContent>

        <TabsContent value="PREPARING">
          <OrdersList status="PREPARING" />
        </TabsContent>

        <TabsContent value="OUT_FOR_DELIVERY">
          <OrdersList status="OUT_FOR_DELIVERY" />
        </TabsContent>

        <TabsContent value="DELIVERED">
          <OrdersList status="DELIVERED" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
