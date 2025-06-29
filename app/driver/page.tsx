"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Navigation, Settings, User, Zap, Target, Award } from "lucide-react"
import { authFetch } from "@/lib/utils"
import { showToast } from "@/components/ui/toast-provider"

interface AvailableOrder {
  id: string
  restaurant: string
  customer: string
  pickup: string
  delivery: string
  distance: string
  payout: number
  time: string
  xp: number
}

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [xpProgress, setXpProgress] = useState(0)
  const [dailyStreak, setDailyStreak] = useState(0)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [deliveriesCount, setDeliveriesCount] = useState(0)
  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [earnings, setEarnings] = useState({
    weekly: 0,
    stats: {
      acceptanceRate: 0,
      customerRating: 0,
      onTimeRate: 0,
      totalDeliveries: 0
    }
  })
  const [profileError, setProfileError] = useState("")

  useEffect(() => {
    loadDriverStats()
    if (isOnline) {
      loadAvailableOrders()
      // Poll for new orders every 30 seconds
      const interval = setInterval(loadAvailableOrders, 30000)
      return () => clearInterval(interval)
    }
  }, [isOnline])

  const loadDriverStats = async () => {
    try {
      const res = await authFetch('/api/driver/stats')
      if (!res.ok) {
        const data = await res.json();
        setProfileError(data.error || 'Failed to fetch driver stats');
        setIsLoading(false);
        return;
      }
      const data = await res.json()
      setCurrentLevel(data.level)
      setXpProgress(data.xpProgress)
      setDailyStreak(data.dailyStreak)
      setTodayEarnings(data.todayEarnings)
      setDeliveriesCount(data.deliveriesCount)
      setEarnings({
        weekly: data.weeklyEarnings || 0,
        stats: {
          acceptanceRate: data.stats?.acceptanceRate || 0,
          customerRating: data.stats?.customerRating || 0,
          onTimeRate: data.stats?.onTimeRate || 0,
          totalDeliveries: data.stats?.totalDeliveries || 0
        }
      })
      setProfileError("");
      setIsLoading(false)
    } catch (error) {
      setProfileError('Failed to load driver statistics');
      setIsLoading(false)
    }
  }

  const loadAvailableOrders = async () => {
    if (!isOnline) return
    try {
      const res = await authFetch('/api/driver/available-orders')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch available orders')
      }
      const data = await res.json()
      setAvailableOrders(data.orders || [])
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to load available orders')
    }
  }

  const toggleOnlineStatus = async () => {
    try {
      setIsLoading(true)
      const newStatus = !isOnline ? 'available' : 'offline'
      
      const res = await authFetch('/api/driver/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.error && data.error.toLowerCase().includes('profile not found')) {
          showToast('error', 'Please complete your driver profile before going online.')
          window.location.href = '/driver/complete-profile'
          return
        }
        throw new Error(data.error || `Failed to set status to ${newStatus}`)
      }

      const data = await res.json()
      setIsOnline(!isOnline)
      showToast('success', `You are now ${newStatus === 'available' ? 'online' : 'offline'}`)

      // If going online, immediately load available orders
      if (newStatus === 'available') {
        await loadAvailableOrders()
      } else {
        setAvailableOrders([])
      }
    } catch (error) {
        console.error('Error toggling online status:', error)
        if (!(error instanceof Error && error.message.toLowerCase().includes('profile not found'))) {
          showToast('error', error instanceof Error ? error.message : 'Failed to update availability status')
        }
      } finally {
        setIsLoading(false)
      }
  }

  const acceptOrder = async (orderId: string) => {
    try {
      const res = await authFetch(`/api/driver/orders/${orderId}/accept`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error('Failed to accept order')
      showToast('success', 'Order accepted successfully')
      loadAvailableOrders() // Refresh available orders
      loadDriverStats() // Refresh stats
    } catch (error) {
      showToast('error', 'Failed to accept order')
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header with Settings Link */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Driver Dashboard</h1>
          <p className="text-teal-600">Welcome back</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/driver/settings">
            <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button
            onClick={toggleOnlineStatus}
            className={`${
              isOnline ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
            disabled={!!profileError}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {profileError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {profileError}
        </div>
      )}

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
                  <p className="text-2xl font-bold text-teal-800">${todayEarnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
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
                  <p className="text-2xl font-bold text-teal-800">{deliveriesCount}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-teal-600" />
                </div>
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
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-teal-100 rounded w-32 mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-4 bg-teal-100 rounded w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-teal-800">
                      ${earnings.weekly.toFixed(2)}
                    </div>
                    <div className="text-sm text-teal-600">
                      Total earnings this week
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader className="bg-teal-50 border-b border-teal-200">
                <CardTitle className="text-teal-800">Performance Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-teal-100 rounded w-24" />
                        <div className="h-4 bg-teal-100 rounded w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-teal-700">Acceptance Rate</span>
                      <span className="font-semibold text-teal-800">{earnings.stats.acceptanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-700">Customer Rating</span>
                      <span className="font-semibold text-teal-800">{earnings.stats.customerRating.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-700">On-time Rate</span>
                      <span className="font-semibold text-teal-800">{earnings.stats.onTimeRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-700">Total Deliveries</span>
                      <span className="font-semibold text-teal-800">{earnings.stats.totalDeliveries}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
