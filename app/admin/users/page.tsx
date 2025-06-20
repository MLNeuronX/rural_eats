"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Eye, Mail, Phone, MapPin } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "buyer" | "vendor" | "driver" | "admin"
  status: "active" | "suspended" | "pending"
  joinedDate: string
  lastActive: string
  totalOrders?: number
  totalSpent?: number
  location: string
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    role: "buyer",
    status: "active",
    joinedDate: "2024-01-15",
    lastActive: "2024-06-08",
    totalOrders: 23,
    totalSpent: 456.78,
    location: "Rural Town, State",
  },
  {
    id: "u2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    role: "buyer",
    status: "active",
    joinedDate: "2024-02-20",
    lastActive: "2024-06-07",
    totalOrders: 15,
    totalSpent: 298.45,
    location: "Rural Town, State",
  },
  {
    id: "u3",
    name: "Mike Restaurant",
    email: "mike@restaurant.com",
    phone: "(555) 345-6789",
    role: "vendor",
    status: "active",
    joinedDate: "2024-01-01",
    lastActive: "2024-06-08",
    location: "Downtown, Rural Town",
  },
  {
    id: "u4",
    name: "Lisa Driver",
    email: "lisa@driver.com",
    phone: "(555) 456-7890",
    role: "driver",
    status: "active",
    joinedDate: "2024-03-10",
    lastActive: "2024-06-08",
    location: "Rural Town, State",
  },
  {
    id: "u5",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "(555) 567-8901",
    role: "buyer",
    status: "suspended",
    joinedDate: "2024-04-05",
    lastActive: "2024-05-20",
    totalOrders: 3,
    totalSpent: 67.23,
    location: "Rural Town, State",
  },
]

function UserCard({ user }: { user: User }) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "buyer":
        return "bg-blue-100 text-blue-800"
      case "vendor":
        return "bg-green-100 text-green-800"
      case "driver":
        return "bg-orange-100 text-orange-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{user.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getRoleColor(user.role)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
            <Badge className={getStatusColor(user.status)}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Joined: </span>
            <span className="font-medium">{new Date(user.joinedDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Active: </span>
            <span className="font-medium">{new Date(user.lastActive).toLocaleDateString()}</span>
          </div>
          {user.role === "buyer" && (
            <>
              <div>
                <span className="text-muted-foreground">Orders: </span>
                <span className="font-medium">{user.totalOrders}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Spent: </span>
                <span className="font-medium">${user.totalSpent?.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">User ID: {user.id}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UsersList({ role }: { role?: string }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = !role || user.role === role

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function UsersPage() {
  const totalUsers = mockUsers.length
  const buyerCount = mockUsers.filter((u) => u.role === "buyer").length
  const vendorCount = mockUsers.filter((u) => u.role === "vendor").length
  const driverCount = mockUsers.filter((u) => u.role === "driver").length
  const activeUsers = mockUsers.filter((u) => u.status === "active").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage platform users</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{buyerCount}</div>
            <p className="text-sm text-muted-foreground">Buyers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{vendorCount}</div>
            <p className="text-sm text-muted-foreground">Vendors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{driverCount}</div>
            <p className="text-sm text-muted-foreground">Drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{activeUsers}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="buyer">Buyers</TabsTrigger>
          <TabsTrigger value="vendor">Vendors</TabsTrigger>
          <TabsTrigger value="driver">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UsersList />
        </TabsContent>

        <TabsContent value="buyer">
          <UsersList role="buyer" />
        </TabsContent>

        <TabsContent value="vendor">
          <UsersList role="vendor" />
        </TabsContent>

        <TabsContent value="driver">
          <UsersList role="driver" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
