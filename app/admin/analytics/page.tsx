"use client"

import * as React from "react"
import { useEffect, useState } from "react"
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
import { TrendingUp, DollarSign, Users, ShoppingBag, Clock, Truck } from "lucide-react"
import { authFetch } from "@/lib/utils"
import { showToast } from "@/components/ui/toast-provider"

const vendorPerformance: any[] = [
  // TODO: Replace with real vendor data from API
]

const orderTrends = [

]

const cuisineDistribution = [
  // TODO: Replace with real cuisine distribution from API
]

const driverMetrics = [
  // TODO: Replace with real driver metrics from API
]

interface DashboardStats {
  total_users: number
  total_vendors: number
  active_vendors: number
  total_drivers: number
  active_drivers: number
  total_orders: number
  users_by_role?: {
    buyers: number
    vendors: number
    drivers: number
    admins: number
  }
}

interface UserAnalytics {
  total_users: number
  users_by_role: Array<{
    role: string
    count: number
    percentage: number
  }>
  recent_users: number
  recent_users_by_role: Record<string, number>
  period: string
}

interface DailyRevenue {
  date: string
  revenue: number
  orders: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null)
  const [revenueData, setRevenueData] = useState<DailyRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDailyRevenue = async () => {
    try {
      const response = await authFetch('/api/admin/daily-revenue');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch daily revenue:', errorData);
        throw new Error(errorData.error || 'Failed to fetch daily revenue data');
      }

      const data = await response.json();
      console.log('Daily revenue data:', data);

      // Handle different possible response formats
      let revenueArray: DailyRevenue[] = [];

      if (Array.isArray(data)) {
        revenueArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        revenueArray = data.data;
      } else if (data.revenue && Array.isArray(data.revenue)) {
        revenueArray = data.revenue;
      } else {
        console.warn('Unexpected revenue data format:', data);
        revenueArray = [];
      }

      // Transform the data for the chart
      const transformedData = revenueArray.map(item => {
        const day = new Date(item.date);
        return {
          day: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          revenue: parseFloat(item.revenue?.toString() || '0'),
          orders: parseInt(item.orders?.toString() || '0')
        };
      });

      setRevenueData(transformedData);
    } catch (err) {
      console.error('Error fetching daily revenue:', err);
      showToast('error', 'Failed to load revenue data');
      setRevenueData([]); // Set empty array on error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsResponse, userResponse] = await Promise.all([
          authFetch('/api/admin/dashboard-stats'),
          authFetch('/api/admin/analytics/users')
        ]);

        // Handle stats response
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('Failed to fetch dashboard stats');
        }

        // Handle user analytics response
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserAnalytics(userData);
        } else {
          console.error('Failed to fetch user analytics');
        }

        // Fetch daily revenue data
        await fetchDailyRevenue();

      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active platform users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_vendors || 0}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Currently open for orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_drivers || 0}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Available for deliveries
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              All-time orders
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Trend */}
      {/* <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Daily Revenue Trend</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              {revenueData.length > 0 ? `Last ${revenueData.length} days` : 'No data available'}
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[320px] w-full">
              {revenueData.length > 0 ? (
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue ($)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 20, bottom: 40, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        fontSize={12}
                        angle={-35}
                        interval={0}
                        textAnchor="end"
                        height={60}
                        tickFormatter={(date) => {
                          const d = new Date(date)
                          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        }}
                      />
                      <YAxis
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `$${parseFloat(value.toString()).toFixed(2)}`,
                              name,
                            ]}
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        fill="var(--color-revenue)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No revenue data available</p>
                  </div>
                </div>
              )}
            </div>
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
      </div> */}

      {/* User Role Distribution */}
      {userAnalytics && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  role: {
                    label: "Role",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userAnalytics.users_by_role}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, percentage }) => `${role} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {userAnalytics.users_by_role.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Role Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userAnalytics.users_by_role.map((roleData, index) => (
                  <div key={roleData.role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{roleData.role}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{roleData.count}</div>
                      <div className="text-sm text-muted-foreground">{roleData.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Role-specific counts from dashboard stats */}
      {stats?.users_by_role && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed User Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.users_by_role.buyers}</div>
                <div className="text-sm text-muted-foreground">Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.users_by_role.vendors}</div>
                <div className="text-sm text-muted-foreground">Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.users_by_role.drivers}</div>
                <div className="text-sm text-muted-foreground">Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.users_by_role.admins}</div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendor Performance and Cuisine Distribution */}
      {/* <div className="grid gap-6 md:grid-cols-2">
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
      </div> */}

      {/* Driver Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground">Active Drivers</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">{stats?.active_drivers || 0}</span>
                <span className="text-sm text-muted-foreground">/ {stats?.total_drivers || 0}</span>
              </div>
              <div className="mt-2 bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{
                    width: `${stats?.total_drivers ? (stats.active_drivers / stats.total_drivers) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
            {driverMetrics.slice(1).map((metric, index) => (
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