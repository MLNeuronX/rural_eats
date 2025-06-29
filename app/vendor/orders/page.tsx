"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, MapPin, MessageCircle, CheckCircle, ChefHat, Package, Truck, Search, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { AssignDriverDialog } from "@/components/vendor/assign-driver-dialog"
import { AutoAssignButton } from "@/components/vendor/auto-assign-button"
import { authFetch } from "@/lib/utils"
import { showToast } from "@/components/ui/toast-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"

interface Order {
  id: string
  status: string
  total_amount: number
  delivery_address: string
  created_at: string
  driver_id?: string
  driver_name?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  buyer_name?: string
  buyer_email?: string
}

const statusMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  NEW: { label: "New", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-100" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  READY: { label: "Ready", icon: Package, color: "text-orange-600", bgColor: "bg-orange-100" },
  DRIVER_ASSIGNED: { label: "Driver Assigned", icon: Truck, color: "text-purple-600", bgColor: "bg-purple-100" },
  DRIVER_ACCEPTED: { label: "Driver Accepted", icon: Truck, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  ACCEPTED: { label: "Accepted", icon: CheckCircle, color: "text-green-700", bgColor: "bg-green-200" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "text-orange-600", bgColor: "bg-orange-100" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  CANCELLED: { label: "Cancelled", icon: ArrowLeft, color: "text-red-600", bgColor: "bg-red-100" },
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [assignDriverDialog, setAssignDriverDialog] = useState<{
    open: boolean
    orderId: string | null
  }>({ open: false, orderId: null })

  useEffect(() => {
    loadOrders()
    // Set up real-time polling every 10 seconds
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com"
      const response = await authFetch(`${baseApiUrl}/api/order/vendor/orders`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vendor orders')
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      showToast('error', 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.buyer_name && order.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const handleDriverAssigned = async (orderId: string, driverId: string, driverName: string) => {
    try {
      // Update order status to driver assigned
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com"
      const response = await authFetch(`${baseApiUrl}/api/order/vendor/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'driver_assigned' }),
      })

      if (response.ok) {
        showToast('success', `Driver ${driverName} assigned successfully!`)
        loadOrders() // Refresh orders
      } else {
        showToast('error', 'Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to assign driver:', error)
      showToast('error', 'Failed to assign driver')
    }
  }

  const createTestOrder = async () => {
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com"
      const response = await authFetch(`${baseApiUrl}/api/order/vendor/test-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body, the endpoint handles everything
      })

      if (response.ok) {
        const newOrder = await response.json()
        showToast('success', `Test order created! ID: ${newOrder.order.id}`)
        loadOrders() // Refresh orders
      } else {
        const error = await response.text()
        showToast('error', `Failed to create test order: ${error}`)
      }
    } catch (error) {
      console.error('Error creating test order:', error)
      showToast('error', 'Failed to create test order')
    }
  }

  const getOrdersByStatus = (status: string) => {
    return filteredOrders.filter(order => order.status === status)
  }

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Loading orders..." />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/vendor">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage your restaurant orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadOrders} variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={createTestOrder} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Test Order
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by ID, address, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {Object.keys(statusMap).map((status) => (
              <option key={status} value={status}>
                {statusMap[status].label} ({getStatusCount(status)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({filteredOrders.length})</TabsTrigger>
          <TabsTrigger value="NEW">New ({getStatusCount('NEW')})</TabsTrigger>
          <TabsTrigger value="PREPARING">Preparing ({getStatusCount('PREPARING')})</TabsTrigger>
          <TabsTrigger value="READY">Ready ({getStatusCount('READY')})</TabsTrigger>
          <TabsTrigger value="DRIVER_ASSIGNED">Assigned ({getStatusCount('DRIVER_ASSIGNED')})</TabsTrigger>
          <TabsTrigger value="DELIVERED">Delivered ({getStatusCount('DELIVERED')})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 text-center">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Orders will appear here when customers place them"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={index}
                  onDriverAssigned={handleDriverAssigned}
                  onRefresh={loadOrders}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {Object.keys(statusMap).map((status) => {
          const StatusIcon = statusMap[status].icon
          return (
            <TabsContent key={status} value={status} className="space-y-4">
              {getOrdersByStatus(status).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <StatusIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No {statusMap[status].label} orders</h3>
                    <p className="text-gray-500">Orders with this status will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {getOrdersByStatus(status).map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onDriverAssigned={handleDriverAssigned}
                      onRefresh={loadOrders}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Assign Driver Dialog */}
      <AssignDriverDialog
        open={assignDriverDialog.open}
        onOpenChange={(open) => setAssignDriverDialog({ open, orderId: null })}
        orderId={assignDriverDialog.orderId || ""}
        onDriverAssigned={(driverId, driverName) => {
          if (assignDriverDialog.orderId) {
            handleDriverAssigned(assignDriverDialog.orderId, driverId, driverName)
          }
          setAssignDriverDialog({ open: false, orderId: null })
        }}
      />
    </div>
  )
}

// Order Card Component
function OrderCard({ 
  order, 
  index, 
  onDriverAssigned, 
  onRefresh 
}: { 
  order: Order
  index: number
  onDriverAssigned: (orderId: string, driverId: string, driverName: string) => void
  onRefresh: () => void
}) {
  const status = statusMap[order.status] || statusMap['NEW']
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-5 w-5 ${status.color}`} />
              <div>
                <CardTitle className="text-lg">
                  Order #{typeof order.id === 'string' ? order.id.slice(0, 8) : ''}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {typeof order.created_at === 'string' ? new Date(order.created_at).toLocaleString() : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${status.bgColor} ${status.color}`}>
                {status.label}
              </Badge>
              <span className="text-lg font-bold">${typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="font-medium">Items:</h4>
            <div className="space-y-1">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx) => {
                  if (
                    typeof item === 'object' &&
                    item !== null &&
                    'name' in item &&
                    'quantity' in item &&
                    'price' in item
                  ) {
                    return (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    )
                  }
                  return null
                })
              ) : (
                <span className="text-muted-foreground">No items</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground">{typeof order.delivery_address === 'string' ? order.delivery_address : ''}</p>
            </div>
          </div>

          {/* Driver Info */}
          {typeof order.driver_name === 'string' && order.driver_name && (
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Driver</p>
                <p className="text-sm text-muted-foreground">{order.driver_name}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link href={typeof order.id === 'string' ? `/vendor/orders/${order.id}` : '#'} className="flex-1">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>

            {order.status === "READY" && !order.driver_id && (
              <>
                {typeof order.id === 'string' && (
                  <AutoAssignButton
                    orderId={order.id}
                    onDriverAssigned={(driver) => {
                      if (driver && typeof driver === 'object' && 'id' in driver && 'name' in driver) {
                        onDriverAssigned(order.id, driver.id, driver.name)
                      }
                    }}
                    disabled={false}
                  />
                )}
                {typeof order.id === 'string' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // This would open the manual assign dialog
                      console.log('Manual assign for order:', order.id)
                    }}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Manual
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
