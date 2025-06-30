"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Truck, ShoppingBag, DollarSign, Users, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import { getVendors } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { authFetch } from "@/lib/utils"

// Lazy load heavy components
const DashboardStats = lazy(() => import('./components/DashboardStats'))
const SystemActivity = lazy(() => import('./components/SystemActivity'))
const SystemHealth = lazy(() => import('./components/SystemHealth'))

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Memoized fetch function with caching
const fetchStats = async () => {
  try {
    // Use Promise.all for parallel requests
    const [dashboardStatsRes, todayOrdersRes] = await Promise.all([
      authFetch("/api/admin/dashboard-stats"),
      authFetch(`/api/admin/analytics/orders?date=${getTodayDateString()}`)
    ]);

    const dashboardStats = dashboardStatsRes.ok ? await dashboardStatsRes.json() : {};
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

// Loading skeleton component
const LoadingSkeleton = () => (
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
);

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

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Reduced floating elements for better performance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-300/30 rounded-full"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 0.5,
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
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Overview</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your system status.</p>
        </motion.div>

        <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>}>
          <DashboardStats stats={stats} />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<div className="h-64 bg-slate-200 rounded-xl animate-pulse" />}>
            <SystemActivity />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 bg-slate-200 rounded-xl animate-pulse" />}>
            <SystemHealth />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
