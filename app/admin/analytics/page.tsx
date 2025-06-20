"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, DollarSign, Users, ShoppingBag, Clock } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 12000, orders: 340, customers: 120 },
  { month: "Feb", revenue: 15000, orders: 420, customers: 150 },
  { month: "Mar", revenue: 18000, orders: 510, customers: 180 },
  { month: "Apr", revenue: 22000, orders: 620, customers: 220 },
  { month: "May", revenue: 25000, orders: 710, customers: 250 },
  { month: "Jun", revenue: 28000, orders: 800, customers: 280 },
]

const vendorPerformance = [
  { name: "Mary's Diner", orders: 120, revenue: 8500, rating: 4.5 },
  { name: "Pizza Palace", orders: 95, revenue: 7200, rating: 4.0 },
  { name: "Taco Shack", orders: 88, revenue: 6800, rating: 4.2 },
  { name: "BBQ Pit", orders: 82, revenue: 6400, rating: 4.8 },
  { name: "Thai Delight", orders: 75, revenue: 5900, rating: 4.6 },
]

const orderTrends = [
  { hour: "06:00", orders: 5 },
  { hour: "08:00", orders: 12 },
  { hour: "10:00", orders: 8 },
  { hour: "12:00", orders: 35 },
  { hour: "14:00", orders: 28 },
  { hour: "16:00", orders: 15 },
  { hour: "18:00", orders: 45 },
  { hour: "20:00", orders: 38 },
  { hour: "22:00", orders: 22 },
]

const cuisineDistribution = [
  { name: "American", value: 30, color: "#8884d8" },
  { name: "Mexican", value: 20, color: "#82ca9d" },
  { name: "Italian", value: 15, color: "#ffc658" },
  { name: "Mexican", value: 20, color: "#82ca9d" },
  { name: "Italian", value: 15, color: "#ffc658" },
  { name: "Asian", value: 18, color: "#ff7300" },
  { name: "BBQ", value: 12, color: "#0088fe" },
  { name: "Other", value: 5, color: "#00c49f" },
]

const driverMetrics = [
  { name: "Active Drivers", current: 8, target: 12 },
  { name: "Avg Delivery Time", current: 28, target: 25 },
  { name: "Customer Rating", current: 4.7, target: 4.5 },
  { name: "Orders/Driver", current: 15, target: 20 },
]

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform performance insights and metrics</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +16.7% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">280</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">800</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.7% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28m</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3m from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance and Cuisine Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuisine Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                american: { label: "American", color: "#8884d8" },
                mexican: { label: "Mexican", color: "#82ca9d" },
                italian: { label: "Italian", color: "#ffc658" },
                asian: { label: "Asian", color: "#ff7300" },
                bbq: { label: "BBQ", color: "#0088fe" },
                other: { label: "Other", color: "#00c49f" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cuisineDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {cuisineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {driverMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground">{metric.name}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{metric.current}</span>
                  <span className="text-sm text-muted-foreground">/ {metric.target}</span>
                </div>
                <div className="mt-2 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${(metric.current / metric.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
