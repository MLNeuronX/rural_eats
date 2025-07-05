"use client"

import * as React from "react"
import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Eye, Phone, Mail, MapPin, Star } from "lucide-react"
import AddDriverDialog from "@/components/admin/add-driver-dialog"
import { authFetch } from "@/lib/utils"
import { showToast } from "@/components/ui/toast-provider"

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  vehicle_type: string
  role: string
  created_at: string
  updated_at: string
  availability_status: string
}

function DriverCard({
  driver,
  onToggleStatus,
  onToggleOnline,
}: {
  driver: Driver
  onToggleStatus: (driver: Driver, status: "active" | "suspended") => void
  onToggleOnline: (driver: Driver) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async (status: "active" | "suspended") => {
    setIsUpdating(true)
    await onToggleStatus(driver, status)
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
                {(driver.name ?? "")
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
                  <span>Vehicle: {driver.vehicle_type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Joined: {new Date(driver.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {driver.availabilty_status === "active" ? (
              <span className="text-green-700 border border-green-500 rounded px-2 py-1 text-sm font-semibold">
                Online
              </span>
            ) : (
              <span className="text-red-700 border border-red-500 rounded px-2 py-1 text-sm font-semibold">
                Offline
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Vehicle: </span>
            <span className="font-medium">{driver.vehicle_type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Role: </span>
            <span className="font-medium">{driver.role}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status: </span>
            <span className="font-medium">{driver.availabilty_status}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Joined: </span>
            <span className="font-medium">{new Date(driver.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Set Status:</span>
              <select
                value={driver.availabilty_status}
                onChange={(e) =>
                  handleStatusToggle(e.target.value as "active" | "suspended")
                }
                disabled={isUpdating}
                className="px-2 py-1 border rounded-md bg-background"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/admin/drivers/${driver.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/drivers/${driver.id}?edit=1`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>

  )
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")
  const [onlineFilter, setOnlineFilter] = useState<"all" | "online" | "offline">("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Fixed filterDrivers function
const filterDrivers = () => {
  let filtered = drivers

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (driver) =>
        (driver.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (driver.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (driver.vehicle_type?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
    )
  }

  // Status filter - FIXED LOGIC
  if (statusFilter !== "all") {
    filtered = filtered.filter((driver) => {
      if (statusFilter === "active") {
        return driver.availabilty_status === 'active'
      } else if (statusFilter === "suspended") {
        return driver.availabilty_status === 'suspended'
      }
      return true
    })
  }

  // Online filter - FIXED LOGIC (assuming this should filter by availability_status)
  if (onlineFilter !== "all") {
    filtered = filtered.filter((driver) => {
      if (onlineFilter === "online") {
        return driver.availabilty_status === 'active'
      } else if (onlineFilter === "offline") {
        return driver.availabilty_status !== 'active'
      }
      return true
    })
  }

  setFilteredDrivers(filtered)
}

  React.useEffect(() => {
    filterDrivers()
  }, [drivers, searchTerm, statusFilter, onlineFilter])

  const handleToggleDriverStatus = async (driver: Driver, status: "online" | "offline") => {
    try {
      const res = await authFetch(`/api/admin/changeDriverStatus/${driver.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      })

      if (!res.ok) {
        const err = await res.json()
        console.error("PATCH failed:", err)
        showToast("error", err?.error || "Failed to update driver status")
        return
      }

      showToast("success", "Driver status updated successfully")

      // ✅ Re-fetch the drivers list to reflect the latest state
      await fetchDrivers()
    } catch (err) {
      console.error("Error updating status:", err)
      showToast("error", "Server error updating driver")
    }
  }





  const handleToggleDriverOnline = async (driver: Driver) => {
    try {
      const updatedDrivers = drivers.map((d) => (d.id === driver.id ? { ...d, availability_status: d.availability_status === 'available' ? 'offline' : 'available' } : d))
      setDrivers(updatedDrivers)
    } catch (error) {
      // Handle error
    }
  }

  const fetchDrivers = async () => {
    try {
      console.log('Fetching drivers...')
      const res = await authFetch("/api/admin/getDrivers");
      console.log("Fetch drivers response status:", res.status);

      if (!res.ok) {
        let data: any = {};
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse drivers response:", e);
        }

        console.log("Fetch drivers error data:", data);

        let errorMessage = "Failed to fetch drivers";
        if (res.status === 422) {
          // For 422 errors, try to extract more specific error information
          if (data.msg === 'Not enough segments') {
            errorMessage = "Authentication token is invalid. Please log out and log back in.";
          } else if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map((err: any) => err.message || err).join(", ");
          } else if (data.validation_errors) {
            errorMessage = data.validation_errors;
          } else {
            errorMessage = "Validation error: " + (data.message || data.msg || "Please check your input data");
          }
        } else if (res.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (res.status === 403) {
          errorMessage = "Access denied. Admin privileges required.";
        } else if (data.error) {
          errorMessage = data.error;
        }

        console.error(errorMessage);
        showToast('error', errorMessage);
        return;
      }

      let data: any = [];
      try {
        data = await res.json();
      } catch (e) {
        console.error("Failed to parse drivers response:", e);
        return;
      }
      // Handle new backend response structure
      const driversArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      if (!Array.isArray(driversArray)) {
        console.error("Expected array of drivers, got:", typeof driversArray);
        return;
      }
      const mapped = driversArray.map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        vehicle_type: d.vehicle_type,
        role: d.role,
        created_at: d.created_at,
        updated_at: d.updated_at,
        availabilty_status: d.availabilty_status,
      }));
      setDrivers(mapped);
      console.log("Updated drivers list:", mapped);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      showToast('error', "Failed to fetch drivers");
    }
  };

  const handleAddDriver = async (driver: { name: string; email: string; phone: string; vehicle_type: string; password: string }) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
        showToast('error', "You are not logged in. Please log in again.");
        // Redirect to login page
        window.location.href = '/login';
        return;
      }

      const res = await authFetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driver),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
      }

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (!res.ok) {
        // Handle different error response formats
        let errorMessage = "Failed to add driver";
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (res.status === 422) {
          // For 422 errors, try to extract more specific error information
          if (data.msg === 'Not enough segments') {
            errorMessage = "Authentication token is invalid. Please log out and log back in.";
            // Redirect to login page
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map((err: any) => err.message || err).join(", ");
          } else if (data.validation_errors) {
            errorMessage = data.validation_errors;
          } else {
            errorMessage = "Validation error: " + (data.message || data.msg || "Please check your input data");
          }
        } else if (res.status === 409) {
          errorMessage = "Driver with this email already exists";
        } else if (res.status === 400) {
          errorMessage = "Invalid request data";
        } else if (res.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
          // Redirect to login page
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (res.status === 403) {
          errorMessage = "Access denied. Admin privileges required.";
        }

        showToast('error', errorMessage);
        throw new Error(errorMessage);
      }

      // New backend returns {data: [drivers]}
      const driversArrayAdd = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      if (!Array.isArray(driversArrayAdd) || driversArrayAdd.length === 0) {
        const errorMessage = "Invalid response from server";
        showToast('error', errorMessage);
        throw new Error(errorMessage);
      }
      // The first driver in the array is the newly added one (since backend orders by created_at desc)
      const newDriver = driversArrayAdd[0];
      await fetchDrivers();
      // Generate registration link
      const link = `${window.location.origin}/driver/complete-profile?driverId=${newDriver.id}`;
      try {
        await navigator.clipboard.writeText(link);
        showToast('success', "Registration link copied to clipboard! Link: " + link);
      } catch {
        showToast('success', "Registration link generated! Link: " + link);
      }
    } catch (error: any) {
      console.error("Error adding driver:", error);
      // Don't show error again if we already showed it above
      if (!error.message.includes("Failed to add driver") && !error.message.includes("Validation error") && !error.message.includes("Invalid response")) {
        showToast('error', error.message || "Failed to add driver");
      }
      throw error;
    }
  };

  React.useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drivers</h1>
          <p className="text-muted-foreground">Manage delivery drivers</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>
      <AddDriverDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddDriver={handleAddDriver} />

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
              {drivers.filter((d) => d.availabilty_status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Currently Online</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{drivers.filter((d) => d.availabilty_status === 'active').length}</div>
            <p className="text-sm text-muted-foreground">Active Drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(drivers.reduce((sum, d) => sum + (d.availabilty_status === 'active' ? 1 : 0), 0) / drivers.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Average Availability</p>
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
              key={driver.id + driver.availability_status} // ✅ this ensures re-render on status change
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
