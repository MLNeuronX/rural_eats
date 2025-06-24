"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { motion } from "framer-motion"
import { DollarSign, Package, Clock, TrendingUp, Star, CheckCircle, Settings, Menu, Eye } from "lucide-react"
import { showToast } from "@/components/ui/toast-provider"

export default function VendorDashboard() {
  const [activeOrders, setActiveOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Smith",
      items: ["Burger Combo", "Fries", "Coke"],
      total: 24.99,
      status: "preparing",
      time: "5 min ago",
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      items: ["Caesar Salad", "Iced Tea"],
      total: 12.5,
      status: "ready",
      time: "2 min ago",
    },
    {
      id: "ORD-003",
      customer: "Mike Davis",
      items: ["Pizza Margherita", "Garlic Bread"],
      total: 18.75,
      status: "new",
      time: "Just now",
    },
  ])

  const [creatingOrder, setCreatingOrder] = useState(false)

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setActiveOrders((orders) => orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "preparing":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCreateTestOrder = async () => {
    setCreatingOrder(true)
    // TODO: Replace with real API call if needed
    setTimeout(() => {
      showToast.success("Test order created!")
      setCreatingOrder(false)
    }, 1000)
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Printer Onboarding Call-to-Action */}
      <div className="mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-yellow-900">Connect your kitchen printer before going live!</div>
            <div className="text-yellow-700 text-sm">Enable automatic kitchen printouts for new orders.</div>
          </div>
          <Link href="/vendor/onboarding">
            <button className="ml-4 px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition">Connect Printer</button>
          </Link>
        </div>
      </div>

      {/* Test Order Button */}
      <div className="mb-6 flex justify-end">
        <button onClick={handleCreateTestOrder} disabled={creatingOrder} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          {creatingOrder ? "Creating..." : "Create Test Order"}
        </button>
      </div>

      {/* Header with Settings Link */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Restaurant Dashboard</h1>
          <p className="text-green-600">Welcome back, Mary's Diner</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/vendor/menu">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              <Menu className="h-4 w-4 mr-2" />
              Manage Menu
            </Button>
          </Link>
          <Link href="/vendor/settings">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Today's Revenue</p>
                  <p className="text-2xl font-bold text-green-800">$247.50</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Orders Today</p>
                  <p className="text-2xl font-bold text-green-800">23</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">3 pending orders</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Avg. Prep Time</p>
                  <p className="text-2xl font-bold text-green-800">12 min</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">Target: 15 min</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Rating</p>
                  <p className="text-2xl font-bold text-green-800">4.8</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">Based on 127 reviews</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-green-50 border border-green-200">
          <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Active Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-green-800">Active Orders</CardTitle>
              <CardDescription>Manage your current orders</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {activeOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 border-b border-green-100 last:border-b-0 hover:bg-green-25 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-green-800">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <span className="text-sm text-green-600">{order.time}</span>
                        </div>
                        <p className="text-green-700 mb-1">Customer: {order.customer}</p>
                        <p className="text-sm text-green-600 mb-2">Items: {order.items.join(", ")}</p>
                        <p className="font-semibold text-green-800">${order.total}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === "new" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Accept
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Ready for Pickup</span>
                          </div>
                        )}
                        <Link href={`/vendor/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-200">
                <CardTitle className="text-green-800">Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Monday</span>
                    <span className="font-semibold text-green-800">$156.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Tuesday</span>
                    <span className="font-semibold text-green-800">$203.25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Wednesday</span>
                    <span className="font-semibold text-green-800">$189.75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Today</span>
                    <span className="font-semibold text-green-800">$247.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-200">
                <CardTitle className="text-green-800">Popular Items</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Burger Combo</span>
                    <span className="font-semibold text-green-800">12 orders</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Caesar Salad</span>
                    <span className="font-semibold text-green-800">8 orders</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Pizza Margherita</span>
                    <span className="font-semibold text-green-800">6 orders</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Fish & Chips</span>
                    <span className="font-semibold text-green-800">5 orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
