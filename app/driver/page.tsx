"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Navigation, Settings, User, Zap, Target, Award } from "lucide-react"

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [currentLevel, setCurrentLevel] = useState(7)
  const [xpProgress, setXpProgress] = useState(65) // 65% to next level
  const [dailyStreak, setDailyStreak] = useState(12)

  const [availableOrders, setAvailableOrders] = useState([
    {
      id: "DEL-001",
      restaurant: "Mary's Diner",
      customer: "John Smith",
      pickup: "123 Main St",
      delivery: "456 Oak Ave",
      distance: "2.3 miles",
      payout: 8.5,
      time: "15 min",
      xp: 25,
    },
    {
      id: "DEL-002",
      restaurant: "Pizza Palace",
      customer: "Sarah Johnson",
      pickup: "789 Pine St",
      delivery: "321 Elm St",
      distance: "1.8 miles",
      payout: 6.75,
      time: "12 min",
      xp: 20,
    },
  ])

  const acceptOrder = (orderId: string) => {
    setAvailableOrders((orders) => orders.filter((order) => order.id !== orderId))
    // Simulate XP gain
    setXpProgress((prev) => Math.min(prev + 25, 100))
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header with Settings Link */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Driver Dashboard</h1>
          <p className="text-teal-600">Welcome back, John Driver</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/driver/settings">
            <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button
            onClick={() => setIsOnline(!isOnline)}
            className={`${
              isOnline ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm font-medium">Driver Level</p>
                  <p className="text-2xl font-bold text-teal-800">Level {currentLevel}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-teal-600">XP Progress</span>
                  <span className="text-teal-600">{xpProgress}%</span>
                </div>
                <div className="w-full bg-teal-100 rounded-full h-2">
                  <motion.div
                    className="bg-teal-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm font-medium">Today's Earnings</p>
                  <p className="text-2xl font-bold text-teal-800">$67.25</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-teal-600">+15% from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm font-medium">Deliveries Today</p>
                  <p className="text-2xl font-bold text-teal-800">8</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Target className="h-4 w-4 text-teal-500 mr-1" />
                <span className="text-teal-600">Goal: 10 deliveries</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm font-medium">Daily Streak</p>
                  <p className="text-2xl font-bold text-teal-800">{dailyStreak} days</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-teal-600">Streak bonus: +20% XP</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-teal-50 border border-teal-200">
          <TabsTrigger value="orders" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Available Orders
          </TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Earnings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="border-teal-200">
            <CardHeader className="bg-teal-50 border-b border-teal-200">
              <CardTitle className="text-teal-800">Available Deliveries</CardTitle>
              <CardDescription>
                {isOnline ? "Accept orders to start earning" : "Go online to see available orders"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isOnline ? (
                <div className="space-y-0">
                  {availableOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border-b border-teal-100 last:border-b-0 hover:bg-teal-25 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-teal-800">{order.restaurant}</h3>
                            <Badge className="bg-teal-100 text-teal-800 border-teal-200">+{order.xp} XP</Badge>
                          </div>
                          <p className="text-teal-700 mb-1">Customer: {order.customer}</p>
                          <div className="flex items-center gap-4 text-sm text-teal-600 mb-2">
                            <span>📍 {order.pickup}</span>
                            <span>→</span>
                            <span>🏠 {order.delivery}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-teal-600">{order.distance}</span>
                            <span className="text-teal-600">~{order.time}</span>
                            <span className="font-semibold text-green-600">${order.payout}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptOrder(order.id)}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {availableOrders.length === 0 && (
                    <div className="p-8 text-center text-teal-600">
                      <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders available right now. Check back soon!</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-teal-600">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You're currently offline. Go online to see available orders.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-teal-200">
              <CardHeader className="bg-teal-50 border-b border-teal-200">
                <CardTitle className="text-teal-800">Weekly Earnings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Monday</span>
                    <span className="font-semibold text-teal-800">$45.25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Tuesday</span>
                    <span className="font-semibold text-teal-800">$52.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Wednesday</span>
                    <span className="font-semibold text-teal-800">$38.75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Today</span>
                    <span className="font-semibold text-teal-800">$67.25</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="bg-teal-50 border-b border-teal-200">
                <CardTitle className="text-teal-800">Performance Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Acceptance Rate</span>
                    <span className="font-semibold text-teal-800">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Customer Rating</span>
                    <span className="font-semibold text-teal-800">4.9 ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">On-Time Rate</span>
                    <span className="font-semibold text-teal-800">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-700">Total Deliveries</span>
                    <span className="font-semibold text-teal-800">247</span>
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
