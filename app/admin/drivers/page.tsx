"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Edit, Eye, Phone, Mail, MapPin, Star } from "lucide-react"

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  isOnline: boolean
  isActive: boolean
  rating: number
  totalDeliveries: number
  totalEarnings: number
  currentLocation: string
  joinedDate: string
  vehicleType: string
  license: string
}

// Mock driver data
const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "Dave Driver",
    email: "dave@example.com",
    phone: "(555) 123-4567",
    isOnline: true,
    isActive: true,
    rating: 4.8,
    totalDeliveries: 342,
    totalEarnings: 2840,
    currentLocation: "Downtown Rural Town",
    joinedDate: "2024-01-15",
    vehicleType: "Car",
    license: "DL123456789",
  },
  {
    id: "d2",
    name: "Sarah Speed",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    isOnline: false,
    isActive: true,
    rating: 4.9,
    totalDeliveries: 289,
    totalEarnings: 2456,
    currentLocation: "North Side",
    joinedDate: "2024-02-01",
    vehicleType: "Motorcycle",
    license: "DL987654321",
  },
  {
    id: "d3",
    name: "Mike Mobile",
    email: "mike@example.com",
    phone: "(555) 345-6789",
    isOnline: true,
    isActive: true,
    rating: 4.6,
    totalDeliveries: 156,
    totalEarnings: 1340,
    currentLocation: "East District",
    joinedDate: "2024-03-10",
    vehicleType: "Bicycle",
    license: "DL456789123",
  },
  {
    id: "d4",
    name: "Lisa Lightning",
    email: "lisa@example.com",
    phone: "(555) 456-7890",
    isOnline: true,
    isActive: false,
    rating: 4.7,
    totalDeliveries: 198,
    totalEarnings: 1680,
    currentLocation: "West End",
    joinedDate: "2024-02-20",
    vehicleType: "Car",
    license: "DL789123456",
  },
]

function DriverCard({
  driver,
  onToggleStatus,
  onToggleOnline,
}: {
  driver: Driver
  onToggleStatus: (driver: Driver) => void
  onToggleOnline: (driver: Driver) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async () => {
    setIsUpdating(true)
    await onToggleStatus(driver)
    setIsUpdating(false)
  }

  const handleOnlineToggle = async () => {
    setIsUpdating(true)
    await onToggleOnline(driver)
    setIsUpdating(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold">
                {driver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{driver.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{driver.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{driver.currentLocation}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{driver.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={driver.isActive ? "default" : "destructive"}>
              {driver.isActive ? "Active" : "Suspended"}
            </Badge>
            <Badge variant={driver.isOnline ? "default" : "secondary"}>{driver.isOnline ? "Online" : "Offline"}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Vehicle: </span>
            <span className="font-medium">{driver.vehicleType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Deliveries: </span>
            <span className="font-medium">{driver.totalDeliveries}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Earnings: </span>
            <span className="font-medium">${driver.totalEarnings}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Joined: </span>
            <span className="font-medium">{new Date(driver.joinedDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active:</span>
              <Switch checked={driver.isActive} onCheckedChange={handleStatusToggle} disabled={isUpdating} />
            </div>
            {driver.isActive && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Online:</span>
                <Switch checked={driver.isOnline} onCheckedChange={handleOnlineToggle} disabled={isUpdating} />
              </div>
            )}
          </div>
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

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")
  const [onlineFilter, setOnlineFilter] = useState<"all" | "online" | "offline">("all")
  const { toast } = useToast()

  const filterDrivers = () => {
    let filtered = drivers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          driver.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((driver) => (statusFilter === "active" ? driver.isActive : !driver.isActive))
    }

    // Online filter
    if (onlineFilter !== "all") {
      filtered = filtered.filter((driver) => (onlineFilter === "online" ? driver.isOnline : !driver.isOnline))
    }

    setFilteredDrivers(filtered)
  }

  React.useEffect(() => {
    filterDrivers()
  }, [drivers, searchTerm, statusFilter, onlineFilter])

  const handleToggleDriverStatus = async (driver: Driver) => {
    try {
      const updatedDrivers = drivers.map((d) =>
        d.id === driver.id ? { ...d, isActive: !d.isActive, isOnline: !d.isActive ? false : d.isOnline } : d,
      )
      setDrivers(updatedDrivers)
      toast({
        title: "Status updated",
        description: `${driver.name} has been ${!driver.isActive ? "activated" : "suspended"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update driver status",
        variant: "destructive",
      })
    }
  }

  const handleToggleDriverOnline = async (driver: Driver) => {
    try {
      const updatedDrivers = drivers.map((d) => (d.id === driver.id ? { ...d, isOnline: !d.isOnline } : d))
      setDrivers(updatedDrivers)
      toast({
        title: "Online status updated",
        description: `${driver.name} is now ${!driver.isOnline ? "online" : "offline"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update driver online status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drivers</h1>
          <p className="text-muted-foreground">Manage delivery drivers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "suspended")}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={onlineFilter}
          onChange={(e) => setOnlineFilter(e.target.value as "all" | "online" | "offline")}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Availability</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{drivers.length}</div>
            <p className="text-sm text-muted-foreground">Total Drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {drivers.filter((d) => d.isActive && d.isOnline).length}
            </div>
            <p className="text-sm text-muted-foreground">Currently Online</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{drivers.filter((d) => d.isActive).length}</div>
            <p className="text-sm text-muted-foreground">Active Drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Drivers List */}
      {filteredDrivers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No drivers found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onToggleStatus={handleToggleDriverStatus}
              onToggleOnline={handleToggleDriverOnline}
            />
          ))}
        </div>
      )}
    </div>
  )
}
