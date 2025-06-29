"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Truck, ShoppingBag, DollarSign, Users, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import { getVendors } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { authFetch } from "@/lib/utils"

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

const fetchStats = async () => {
  try {
    const dashboardStatsRes = await authFetch("/api/admin/dashboard-stats");
    const dashboardStats = dashboardStatsRes.ok ? await dashboardStatsRes.json() : {};

    const todayOrdersRes = await authFetch(`/api/admin/analytics/orders?date=${getTodayDateString()}`);
    const todayOrdersData = todayOrdersRes.ok ? await todayOrdersRes.json() : {};

    return {
      totalUsers: dashboardStats.total_users || 0,
      totalVendors: dashboardStats.users_by_role?.vendors ?? 0,
      activeVendors: dashboardStats.active_vendors || 0,
      totalDrivers: dashboardStats.users_by_role?.drivers ?? 0,
      activeDrivers: dashboardStats.active_drivers || 0,
      totalOrders: dashboardStats.total_orders || 0,
      todayOrders: todayOrdersData.total_orders || 0,
      totalRevenue: todayOrdersData.total_revenue || 0,
      todayRevenue: todayOrdersData.total_revenue || 0,
      users_by_role: dashboardStats.users_by_role || { admins: 0, vendors: 0, drivers: 0, buyers: 0 },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      totalVendors: 0,
      activeVendors: 0,
      totalDrivers: 0,
      activeDrivers: 0,
      totalOrders: 0,
      todayOrders: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      users_by_role: { admins: 0, vendors: 0, drivers: 0, buyers: 0 },
    };
  }
};

export default function AdminDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    activeVendors: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    users_by_role: { admins: 0, vendors: 0, drivers: 0, buyers: 0 },
  })

  useEffect(() => {
    let mounted = true

    const loadDashboardData = async () => {
      try {
        const realStats = await fetchStats()
        if (mounted) setStats(realStats)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        if (mounted) setIsLoading(false)
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
      value: (stats.totalUsers ?? 0).toString(),
      icon: Users,
      change: "",
      color: "from-slate-500 to-gray-500",
      href: "/admin/users",
    },
    {
      title: "Active Vendors",
      value: (stats.activeVendors ?? 0).toString(),
      icon: Store,
      change: `${stats.activeVendors ?? 0} currently open`,
      color: "from-indigo-500 to-blue-500",
      href: "/admin/vendors?status=open",
    },
    {
      title: "Active Drivers",
      value: (stats.activeDrivers ?? 0).toString(),
      icon: Truck,
      change: `of ${(stats.totalDrivers ?? 0).toString()} total drivers`,
      color: "from-purple-500 to-indigo-500",
      href: "/admin/drivers?status=active",
    },
    {
      title: "Admins",
      value: (stats.users_by_role?.admins ?? 0).toString(),
      icon: Users,
      change: "",
      color: "from-purple-600 to-purple-800",
      href: "/admin/users?role=admin",
    },
    {
      title: "Today's Orders",
      value: (stats.todayOrders ?? 0).toString(),
      icon: ShoppingBag,
      change: `${stats.totalOrders ?? 0} total orders`,
      color: "from-blue-500 to-cyan-500",
      href: "/admin/orders?date=today",
    },
    {
      title: "Today's Revenue",
      value: `$${(stats.todayRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      change: `$${(stats.totalRevenue ?? 0).toLocaleString()} total revenue`,
      color: "from-green-500 to-emerald-500",
      href: "/admin/orders?date=today",
    },
    {
      title: "Growth Rate",
      value: "-",
      icon: TrendingUp,
      change: "Loading...",
      color: "from-emerald-500 to-teal-500",
      href: "/admin/analytics",
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
              <Link href={stat.href} className="block focus:outline-none">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
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
              </Link>
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
                  {/* TODO: Replace with real system activity data from API */}
                  <div className="text-center text-gray-500 py-8">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                      </div>
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
                  {/* TODO: Replace with real system health metrics from API */}
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">System health data loading...</p>
                      </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
