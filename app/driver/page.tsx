"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, DollarSign, Zap, Target, Award, TrendingUp, Package, Clock } from "lucide-react"
import Link from "next/link"
import { useAppStore, type OrderStatus } from "@/lib/store"
import { useNotifications } from "@/components/notifications/notification-provider"

export default function DriverDashboard() {
  const { showToast } = useNotifications()
  const { orders, updateOrderStatus, updateDriverStatus, currentUser, drivers } = useAppStore()

  const [isOnline, setIsOnline] = useState(true)
  const [currentXP, setCurrentXP] = useState(1250)
  const [dailyDeliveries, setDailyDeliveries] = useState(7)
  const [dailyEarnings, setDailyEarnings] = useState(67.25)
  const [streak, setStreak] = useState(12)
  const [acceptedOrders, setAcceptedOrders] = useState<string[]>([])

  // Gamification calculations
  const currentLevel = Math.floor(currentXP / 500) + 1
  const xpForNextLevel = currentLevel * 500
  const xpProgress = ((currentXP % 500) / 500) * 100
  const dailyGoal = 10
  const dailyProgress = (dailyDeliveries / dailyGoal) * 100

  // Get available orders (READY status)
  const availableOrders = orders.filter((order) => order.status === "READY" && !acceptedOrders.includes(order.id))

  // Get driver's assigned orders
  const myOrders = orders.filter(
    (order) => order.driverId === currentUser?.id && ["ASSIGNED", "OUT_FOR_DELIVERY"].includes(order.status),
  )

  const handleToggleOnline = (online: boolean) => {
    setIsOnline(online)
    if (currentUser) {
      updateDriverStatus(currentUser.id, online)
    }

    showToast({
      title: online ? "You're Online!" : "You're Offline",
      message: online ? "You'll receive delivery requests" : "You won't receive new requests",
      type: "info",
    })
  }

  const handleAcceptOrder = (orderId: string) => {
    if (!currentUser) return

    // Simulate driver acceptance (80% success rate)
    const accepted = Math.random() > 0.2

    if (accepted) {
      updateOrderStatus(orderId, "ASSIGNED", currentUser.id)
      setAcceptedOrders((prev) => [...prev, orderId])

      // XP and earnings update
      setCurrentXP((prev) => prev + 25)
      setDailyEarnings((prev) => prev + 8.5)

      showToast({
        title: "Order Accepted! +25 XP",
        message: `Order #${orderId} assigned to you`,
        type: "success",
      })
    } else {
      showToast({
        title: "Order Unavailable",
        message: "This order was assigned to another driver",
        type: "warning",
      })
    }
  }

  const handleUpdateDeliveryStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, currentUser?.id)

    if (newStatus === "OUT_FOR_DELIVERY") {
      showToast({
        title: "Delivery Started",
        message: `Order #${orderId} is now out for delivery`,
        type: "info",
      })
    } else if (newStatus === "DELIVERED") {
      setCurrentXP((prev) => prev + 50)
      setDailyDeliveries((prev) => prev + 1)
      setDailyEarnings((prev) => prev + 12.5)

      showToast({
        title: "Delivery Completed! +50 XP",
        message: `Order #${orderId} delivered successfully`,
        type: "success",
      })
    }
  }

  const generateMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  return (
    <div className="min-h-screen bg-driver-background text-white">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header with Online Toggle */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Driver Command Center</h1>
            <p className="text-blue-200">Welcome back, {currentUser?.name}!</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              <span className="text-sm font-medium text-white">{isOnline ? "Online" : "Offline"}</span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                className="data-[state=checked]:bg-lime-500"
              />
            </div>

            <Link href="/driver/settings">
              <Button variant="outline" className="border-blue-300 text-blue-300 hover:bg-blue-500/20">
                Settings
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Driver Level</p>
                    <p className="text-2xl font-bold text-white">Level {currentLevel}</p>
                  </div>
                  <div className="w-10 h-10 bg-lime-500/20 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-lime-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-200">XP Progress</span>
                    <span className="text-blue-200">{Math.round(xpProgress)}%</span>
                  </div>
                  <Progress value={xpProgress} className="h-2 bg-blue-900/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Daily Mission</p>
                    <p className="text-2xl font-bold text-white">
                      {dailyDeliveries}/{dailyGoal}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-orange-400" />
                  </div>
                </div>
                <Progress value={dailyProgress} className="h-2 bg-blue-900/50" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Today's Earnings</p>
                    <p className="text-2xl font-bold text-white">${dailyEarnings.toFixed(2)}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center text-sm mt-2">
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400">+15% from yesterday</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Streak</p>
                    <p className="text-2xl font-bold text-white">{streak} days</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                <p className="text-xs text-blue-200 mt-2">Streak bonus: +20% XP</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border border-blue-300/30">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200"
            >
              Available Missions ({availableOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200"
            >
              Active Deliveries ({myOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="space-y-4">
              {!isOnline ? (
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <p className="text-blue-200 text-lg">You're currently offline</p>
                    <p className="text-blue-300">Go online to see available delivery missions</p>
                  </CardContent>
                </Card>
              ) : availableOrders.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <p className="text-blue-200 text-lg">No missions available</p>
                    <p className="text-blue-300">Check back soon for new delivery opportunities</p>
                  </CardContent>
                </Card>
              ) : (
                availableOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30 hover:bg-white/15 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-white">Mission #{order.id}</h3>
                              <Badge className="bg-lime-500/20 text-lime-400 border-lime-400/30">+25 XP</Badge>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                                Ready for Pickup
                              </Badge>
                            </div>
                            <p className="text-blue-200 mb-1">Restaurant: {order.vendorName}</p>
                            <p className="text-sm text-blue-300">
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""} • ${order.total.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-400 text-lg">${(order.deliveryFee * 0.8).toFixed(2)}</p>
                            <p className="text-xs text-blue-300">Estimated earnings</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-200">Pickup: 123 Main St, Rural Town</span>
                            <span className="text-lime-400">2.3 miles</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-orange-400" />
                            <span className="text-blue-200">Drop-off: {order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            <span className="text-blue-200">Estimated time: 15 minutes</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Accept Mission
                          </Button>
                          <a
                            href={generateMapsLink("123 Main St, Rural Town")}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" className="border-blue-300 text-blue-300 hover:bg-blue-500/20">
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                    <p className="text-blue-200 text-lg">No active deliveries</p>
                    <p className="text-blue-300">Accept missions to start earning</p>
                  </CardContent>
                </Card>
              ) : (
                myOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-orange-300/30">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-white">Mission #{order.id}</h3>
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                                {order.status === "ASSIGNED" ? "Pickup Ready" : "In Transit"}
                              </Badge>
                            </div>
                            <p className="text-blue-200 mb-1">Customer: {order.buyerName}</p>
                            <p className="text-sm text-blue-300">
                              {order.status === "ASSIGNED" ? "Ready for pickup" : "En route to customer"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-400 text-lg">${(order.deliveryFee * 0.8).toFixed(2)}</p>
                            <p className="text-xs text-blue-300">Earnings</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-200">
                              {order.status === "ASSIGNED" ? "Pickup from" : "Picked up from"}: 123 Main St
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-orange-400" />
                            <span className="text-blue-200">Deliver to: {order.deliveryAddress}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {order.status === "ASSIGNED" ? (
                            <Button
                              onClick={() => handleUpdateDeliveryStatus(order.id, "OUT_FOR_DELIVERY")}
                              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            >
                              Start Delivery
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleUpdateDeliveryStatus(order.id, "DELIVERED")}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            >
                              Mark Delivered
                            </Button>
                          )}
                          <a href={generateMapsLink(order.deliveryAddress)} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              className="border-orange-300 text-orange-300 hover:bg-orange-500/20"
                            >
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </a>
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
