"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Truck, ShoppingBag, DollarSign, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

interface DashboardStatsProps {
  stats: {
    totalUsers: number
    totalVendors: number
    activeVendors: number
    totalDrivers: number
    activeDrivers: number
    totalOrders: number
    todayOrders: number
    totalRevenue: number
    todayRevenue: number
    users_by_role: { admins: number; vendors: number; drivers: number; buyers: number }
  }
}

const DashboardStats = memo(({ stats }: DashboardStatsProps) => {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {dashboardStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
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
  )
})

DashboardStats.displayName = 'DashboardStats'

export default DashboardStats 