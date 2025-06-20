"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Phone, CheckCircle, ChefHat, Package, Truck } from "lucide-react"
import Link from "next/link"
import { useAppStore, type OrderStatus } from "@/lib/store"
import { useNotifications } from "@/components/notifications/notification-provider"

export default function VendorOrdersPage() {
  const { showToast } = useNotifications()
  const { getOrdersByUser, updateOrderStatus, currentUser, updateVendorStatus, getVendorById } = useAppStore()

  const [orders, setOrders] = useState(() => (currentUser ? getOrdersByUser(currentUser.id, "vendor") : []))
  const [isOpen, setIsOpen] = useState(true)

  const vendor = currentUser ? getVendorById(currentUser.id) : null

  // Refresh orders periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        const updatedOrders = getOrdersByUser(currentUser.id, "vendor")
        setOrders(updatedOrders)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [currentUser, getOrdersByUser])

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    showToast({
      title: "Order Updated",
      message: `Order #${orderId} marked as ${newStatus.toLowerCase().replace("_", " ")}`,
      type: "success",
    })
  }

  const handleToggleOpen = (open: boolean) => {
    if (currentUser) {
      updateVendorStatus(currentUser.id, open)
      setIsOpen(open)

      showToast({
        title: open ? "Restaurant Opened" : "Restaurant Closed",
        message: `You are now ${open ? "accepting" : "not accepting"} new orders`,
        type: "info",
      })
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PREPARING":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "READY":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "ASSIGNED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusActions = (order: any) => {
    switch (order.status) {
      case "NEW":
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "CONFIRMED")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Confirm
          </Button>
        )
      case "CONFIRMED":
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "PREPARING")}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <ChefHat className="h-4 w-4 mr-1" />
            Start Preparing
          </Button>
        )
      case "PREPARING":
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "READY")}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Package className="h-4 w-4 mr-1" />
            Mark Ready
          </Button>
        )
      case "READY":
        return (
          <div className="flex items-center text-purple-600">
            <Package className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Ready for Pickup</span>
          </div>
        )
      case "ASSIGNED":
        return (
          <div className="flex items-center text-indigo-600">
            <Truck className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Driver Assigned</span>
          </div>
        )
      case "OUT_FOR_DELIVERY":
        return (
          <div className="flex items-center text-orange-600">
            <Truck className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Out for Delivery</span>
          </div>
        )
      case "DELIVERED":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Delivered</span>
          </div>
        )
      default:
        return null
    }
  }

  const activeOrders = orders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.status))
  const completedOrders = orders.filter((order) => ["DELIVERED", "CANCELLED"].includes(order.status))
  const newOrders = orders.filter((order) => order.status === "NEW")

  return (
    <div className="min-h-screen bg-vendor-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <Link href="/vendor">
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold vendor-primary">Order Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-700">{isOpen ? "Open" : "Closed"}</span>
              <Switch
                checked={isOpen}
                onCheckedChange={handleToggleOpen}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">New Orders</p>
                    <p className="text-2xl font-bold text-green-800">{newOrders.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Active Orders</p>
                    <p className="text-2xl font-bold text-green-800">{activeOrders.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-800">
                      ${completedOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-green-50 border border-green-200">
            <TabsTrigger value="active" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No active orders</p>
                    <p className="text-gray-400">New orders will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-green-800">Order #{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-green-700 mb-1">Customer: {order.buyerName}</p>
                            <p className="text-sm text-green-600 mb-2">
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""} •
                              <span className="font-semibold ml-1">${order.total.toFixed(2)}</span>
                            </p>
                            <div className="text-sm text-gray-600">
                              {order.items.map((item, i) => (
                                <span key={i}>
                                  {item.quantity}x {item.name}
                                  {i < order.items.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusActions(order)}
                            <a href={`tel:${order.buyerPhone}`}>
                              <Button variant="outline" size="sm" className="border-green-200">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </a>
                            <Link href={`/vendor/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="border-green-200">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {order.deliveryAddress && (
                          <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                            <strong>Delivery Address:</strong> {order.deliveryAddress}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No completed orders</p>
                    <p className="text-gray-400">Completed orders will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                completedOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-green-800">Order #{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                            </div>
                            <p className="text-green-700 mb-1">Customer: {order.buyerName}</p>
                            <p className="text-sm text-green-600">
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""} •
                              <span className="font-semibold ml-1">${order.total.toFixed(2)}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Completed: {new Date(order.updatedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <Link href={`/vendor/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="border-green-200">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
