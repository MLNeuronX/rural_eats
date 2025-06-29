"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { motion } from "framer-motion"
import { DollarSign, Package, Clock, TrendingUp, Star, CheckCircle, Settings, Menu, Eye, BarChart3, Users, Calendar } from "lucide-react"
import { showToast } from "@/components/ui/toast-provider"
import { RealtimeNotifications } from "@/components/vendor/realtime-notifications"
import { useAuth } from "@/components/auth-provider"
import { authFetch } from "@/lib/utils"
import { realtimeService } from "@/lib/realtime"

export default function VendorDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analytics, setAnalytics] = useState<{
    orderTrends: Array<{ date: string; orders: number }>;
    popularItems: Array<{ name: string; orders: number; revenue: number }>;
    performanceMetrics: {
      avgOrderValue: number;
      totalCustomers: number;
      repeatCustomers: number;
      avgPrepTime: number;
      completionRate: number;
    };
    recentReviews: Array<any>;
  }>({
    orderTrends: [],
    popularItems: [],
    performanceMetrics: {
      avgOrderValue: 0,
      totalCustomers: 0,
      repeatCustomers: 0,
      avgPrepTime: 0,
      completionRate: 0
    },
    recentReviews: []
  })

  // Stats
  const [stats, setStats] = useState({
    revenue: 0,
    orderCount: 0,
    avgPrepTime: 0,
    rating: 0,
    reviewCount: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError("")
      try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
        const res = await authFetch(`${baseApiUrl}/api/order/vendor/orders`)
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data.orders || [])
        // Calculate stats
        let revenue = 0, orderCount = 0, prepTimes = [], pendingOrders = 0
        for (const order of data.orders || []) {
          revenue += order.total_amount || 0
          orderCount++
          if (order.prep_time) prepTimes.push(order.prep_time)
          if (order.status === 'pending' || order.status === 'new' || order.status === 'preparing') pendingOrders++
        }
        
        // Fetch ratings and reviews from a separate endpoint
        const ratingsRes = await authFetch(`${baseApiUrl}/api/vendor/ratings`)
        let rating = 0, reviewCount = 0
        if (ratingsRes.ok) {
          const ratingsData = await ratingsRes.json()
          rating = ratingsData.average_rating || 0
          reviewCount = ratingsData.review_count || 0
        }
        
        setStats({
          revenue,
          orderCount,
          avgPrepTime: prepTimes.length ? Math.round(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length) : 0,
          rating,
          reviewCount,
          pendingOrders,
        })
      } catch (e: any) {
        setError(e.message || "Failed to load data")
        console.error("Error fetching vendor data:", e)
      } finally {
        setLoading(false)
      }
    }

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true)
      try {
        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
        
        // Calculate real analytics from existing orders data
        const realAnalytics = calculateRealAnalytics(orders);
        
        // Fetch reviews from backend
        try {
          const reviewsRes = await authFetch(`${baseApiUrl}/api/vendor/reviews`);
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            realAnalytics.recentReviews = reviewsData.reviews || [];
          }
        } catch (e) {
          console.log("Reviews endpoint not available, using empty reviews");
        }
        
        setAnalytics(realAnalytics);
      } catch (e: any) {
        console.error("Error calculating analytics:", e)
        setAnalytics({
          orderTrends: [],
          popularItems: [],
          performanceMetrics: {
            avgOrderValue: 0,
            totalCustomers: 0,
            repeatCustomers: 0,
            avgPrepTime: 0,
            completionRate: 0
          },
          recentReviews: []
        })
      } finally {
        setAnalyticsLoading(false)
      }
    }

    if (user?.id) {
      fetchOrders()
      fetchAnalytics()
      
      // Connect to real-time service
      realtimeService.connect()
      realtimeService.joinVendorRoom(user.id)
      
      // Listen for real-time updates
      realtimeService.onOrderUpdate((data) => {
        console.log('Order update received:', data)
        // Refresh orders when we get an update
        fetchOrders()
      })
      
      realtimeService.onDriverAssigned((data) => {
        console.log('Driver assigned:', data)
        showToast('success', data.message)
        fetchOrders()
      })
      
      realtimeService.onOrderAccepted((data) => {
        console.log('Order accepted:', data)
        showToast('success', data.message)
        fetchOrders()
      })
    }
  }, [user?.id])

  const calculateRealAnalytics = (orders: any[]) => {
    if (!orders || orders.length === 0) {
      return {
        orderTrends: [],
        popularItems: [],
        performanceMetrics: {
          avgOrderValue: 0,
          totalCustomers: 0,
          repeatCustomers: 0,
          avgPrepTime: 0,
          completionRate: 0
        },
        recentReviews: []
      }
    }

    // Calculate real order trends (last 7 days)
    const orderTrends = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      orderTrends.push({
        date: dayName,
        orders: dayOrders.length
      });
    }

    // Calculate popular items from actual order data
    const itemCounts: Record<string, number> = {};
    const itemRevenue: Record<string, number> = {};
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const itemName = item.name || item.item_name;
          if (itemName) {
            itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
            itemRevenue[itemName] = (itemRevenue[itemName] || 0) + (item.price || 0) * (item.quantity || 1);
          }
        });
      }
    });

    // Convert to array and sort by popularity
    const popularItems = Object.keys(itemCounts).map(name => ({
      name,
      orders: itemCounts[name],
      revenue: itemRevenue[name]
    })).sort((a, b) => b.orders - a.orders).slice(0, 5);

    // Calculate real performance metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Calculate customer metrics
    const customerCounts: Record<string, number> = {};
    orders.forEach(order => {
      const customerId = order.buyer_id || order.customer_id;
      if (customerId) {
        customerCounts[customerId] = (customerCounts[customerId] || 0) + 1;
      }
    });

    const totalCustomers = Object.keys(customerCounts).length;
    const repeatCustomers = Object.values(customerCounts).filter((count: number) => count > 1).length;
    
    // Calculate completion rate
    const completedOrders = orders.filter(order => 
      order.status === 'completed' || order.status === 'delivered' || order.status === 'ready'
    ).length;
    const completionRate = orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;
    
    // Calculate average prep time from actual data
    const ordersWithPrepTime = orders.filter(order => order.prep_time);
    const avgPrepTime = ordersWithPrepTime.length > 0 
      ? Math.round(ordersWithPrepTime.reduce((sum, order) => sum + order.prep_time, 0) / ordersWithPrepTime.length)
      : 0;

    const performanceMetrics = {
      avgOrderValue,
      totalCustomers,
      repeatCustomers,
      avgPrepTime,
      completionRate
    };

    // For reviews, we'll need to fetch from backend if available
    // For now, return empty array - this should be fetched from a real reviews endpoint
    const recentReviews = [];

    return {
      orderTrends,
      popularItems,
      performanceMetrics,
      recentReviews
    }
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

      {/* Real-time Notifications */}
      <RealtimeNotifications vendorId={user?.id || ""} />

      {/* Header with Settings Link */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Restaurant Dashboard</h1>
          <p className="text-green-600">Welcome back</p>
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
                  <p className="text-2xl font-bold text-green-800">${stats.revenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">{stats.orderCount} orders</span>
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
                  <p className="text-2xl font-bold text-green-800">{stats.orderCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">{stats.pendingOrders} pending orders</span>
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
                  <p className="text-2xl font-bold text-green-800">{stats.avgPrepTime} min</p>
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
                  <p className="text-2xl font-bold text-green-800">{stats.rating}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">Based on {stats.reviewCount} reviews</span>
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
              {loading ? (
                <div className="p-6 text-center text-green-700">Loading orders...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-600">{error}</div>
              ) : orders.length === 0 ? (
                <div className="p-6 text-center text-green-700">No active orders.</div>
              ) : (
              <div className="space-y-0">
                  {orders.map((order: any, index: number) => (
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
                            <span className="text-sm text-green-600">{order.created_at ? new Date(order.created_at).toLocaleString() : ""}</span>
                        </div>
                          <p className="text-green-700 mb-1">Customer: {order.buyer_name || order.buyer_id}</p>
                          <p className="text-sm text-green-600 mb-2">Items: {order.items ? order.items.map((item: any) => item.name).join(", ") : "-"}</p>
                          <p className="font-semibold text-green-800">${order.total_amount?.toFixed(2) || 0}</p>
                      </div>
                      <div className="flex items-center gap-2">
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          {analyticsLoading ? (
            <div className="p-6 text-center text-green-700">Loading analytics...</div>
          ) : (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Avg. Order Value</p>
                        <p className="text-2xl font-bold text-green-800">${analytics.performanceMetrics.avgOrderValue.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

            <Card className="border-green-200">
              <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total Customers</p>
                        <p className="text-2xl font-bold text-green-800">{analytics.performanceMetrics.totalCustomers}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                  </div>
                  </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Repeat Customers</p>
                        <p className="text-2xl font-bold text-green-800">{analytics.performanceMetrics.repeatCustomers}</p>
                  </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Completion Rate</p>
                        <p className="text-2xl font-bold text-green-800">{analytics.performanceMetrics.completionRate.toFixed(1)}%</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Trends */}
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50 border-b border-green-200">
                    <CardTitle className="text-green-800">Weekly Order Trends</CardTitle>
                    <CardDescription>Orders per day this week</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {analytics.orderTrends.map((day: any, index: number) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <span className="text-green-700 font-medium">{day.date}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-green-100 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(day.orders / 15) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-green-800 font-semibold w-8 text-right">{day.orders}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Items */}
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50 border-b border-green-200">
                    <CardTitle className="text-green-800">Popular Menu Items</CardTitle>
                    <CardDescription>Top selling items this week</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {analytics.popularItems.map((item: any, index: number) => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-green-800">{item.name}</p>
                            <p className="text-sm text-green-600">{item.orders} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-800">${item.revenue.toFixed(2)}</p>
                            <p className="text-xs text-green-600">revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reviews */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-200">
                  <CardTitle className="text-green-800">Recent Customer Reviews</CardTitle>
                  <CardDescription>Latest feedback from customers</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                    {analytics.recentReviews.map((review: any) => (
                      <div key={review.id} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                  </div>
                        <div className="flex-1">
                          <p className="text-green-800 font-medium">{review.customer}</p>
                          <p className="text-green-700 mt-1">{review.comment}</p>
                          <p className="text-sm text-green-600 mt-2">{review.date}</p>
                  </div>
                  </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
