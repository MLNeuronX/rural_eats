"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Eye, Mail, Phone, MapPin } from "lucide-react"
import AddUserDialog from "@/components/admin/add-user-dialog"
import { showToast } from "@/components/ui/toast-provider"
import { authFetch } from "@/lib/utils"
import { getAdminVendors } from "@/lib/data"
import Link from "next/link"

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
                  ? user.name.split(" ").map((n) => n[0]).join("")
                  : "U"}
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
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/users/${user.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/users/${user.id}?edit=1`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UsersList({ role, users }: { role?: string; users: User[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((user) => {
    if (!user.id || !user.role) return false; // Defensive: skip users without id or role
    const matchesSearch =
      searchTerm === "" ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = !role || (user.role && user.role.toLowerCase() === role.toLowerCase());

    return matchesSearch && matchesRole;
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
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await authFetch("/api/admin/users?per_page=1000");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.data);
    } catch (e) {
      showToast('error', "Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const driverCount = users.filter((u) => u.role === "driver").length;
  const buyerCount = users.filter((u) => u.role === "buyer").length;
  const vendorCount = users.filter((u) => u.role === "vendor").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const totalUsers = driverCount + vendorCount + buyerCount + adminCount;
  const activeUsers = users.filter((u) => u.status === "active").length;

  const handleAddUser = async (user: { name: string; email: string; password: string; role: string }) => {
    try {
      // Call backend API to add user
      const res = await authFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
      }
      if (!res.ok) {
        let errorMessage = "Failed to add user";
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (res.status === 422) {
          errorMessage = "Validation error: Please check your input data";
        } else if (res.status === 409) {
          errorMessage = "User with this email already exists";
        } else if (res.status === 400) {
          errorMessage = "Invalid request data";
        }
        showToast('error', errorMessage);
        throw new Error(errorMessage);
      }
      showToast('success', `User ${user.name} was added successfully.`);
      await fetchUsers(); // Re-fetch users after adding
    } catch (e: any) {
      console.error("Error adding user:", e);
      if (!e.message.includes("Failed to add user") && !e.message.includes("Validation error")) {
        showToast('error', e.message || "Failed to add user.");
      }
      throw e;
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage platform users</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddUser={handleAddUser} />
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
            <div className="text-2xl font-bold text-purple-600">{adminCount}</div>
            <p className="text-sm text-muted-foreground">Admins</p>
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
          <UsersList role="" users={users} />
        </TabsContent>
        <TabsContent value="buyer">
          <UsersList role="buyer" users={users} />
        </TabsContent>
        <TabsContent value="vendor">
          <UsersList role="vendor" users={users} />
        </TabsContent>
        <TabsContent value="driver">
          <UsersList role="driver" users={users} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
