"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Truck, ShoppingBag, DollarSign, Users, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import { getVendors } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    totalDrivers: 12,
    activeDrivers: 8,
    totalOrders: 1250,
    todayOrders: 45,
    totalRevenue: 125000,
    todayRevenue: 3200,
  })

  useEffect(() => {
    let mounted = true

    const loadDashboardData = async () => {
      try {
        const vendors = await getVendors()
        const activeVendors = vendors.filter((v) => v.isOpen).length

        if (mounted) {
          setStats((prev) => ({
            ...prev,
            totalVendors: vendors.length,
            activeVendors,
          }))
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      mounted = false
    }
  }, [])

  const dashboardStats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12% from last month",
      color: "from-slate-500 to-gray-500",
    },
    {
      title: "Active Vendors",
      value: stats.totalVendors.toString(),
      icon: Store,
      change: `${stats.activeVendors} currently open`,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Active Drivers",
      value: stats.activeDrivers.toString(),
      icon: Truck,
      change: `of ${stats.totalDrivers} total drivers`,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      icon: ShoppingBag,
      change: `${stats.totalOrders} total orders`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Today's Revenue",
      value: `$${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `$${stats.totalRevenue.toLocaleString()} total revenue`,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Growth Rate",
      value: "15.3%",
      icon: TrendingUp,
      change: "+2.1% from last month",
      color: "from-emerald-500 to-teal-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl" />
              ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-64 bg-slate-200 rounded-xl" />
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Subtle Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-300/30 rounded-full"
            animate={{
              x: [0, 40, 0],
              y: [0, -40, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="p-6 relative z-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Overview</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your system status.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  System Activity
                </CardTitle>
                <CardDescription>Recent platform events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: Store,
                      message: "New vendor registered: Tony's Pizza",
                      time: "2 hours ago",
                      color: "text-green-500",
                    },
                    {
                      icon: Truck,
                      message: "Driver completed 50 deliveries milestone",
                      time: "4 hours ago",
                      color: "text-blue-500",
                    },
                    {
                      icon: Activity,
                      message: "System maintenance completed",
                      time: "1 day ago",
                      color: "text-indigo-500",
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      <activity.icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  System Health
                </CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Server Uptime", value: "99.9%", status: "operational" },
                    { label: "Response Time", value: "245ms", status: "good" },
                    { label: "Active Sessions", value: "1,847", status: "normal" },
                    { label: "System Status", value: "Operational", status: "operational" },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{metric.value}</span>
                        <Badge
                          variant="outline"
                          className={
                            metric.status === "operational"
                              ? "text-green-600 border-green-200"
                              : metric.status === "good"
                                ? "text-blue-600 border-blue-200"
                                : "text-gray-600 border-gray-200"
                          }
                        >
                          {metric.status === "operational" ? "✓" : metric.status === "good" ? "◐" : "○"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
