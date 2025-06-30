"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Eye, MapPin, Star } from "lucide-react"
import { getAdminVendors, updateVendorAvailability, type Vendor } from "@/lib/data"
import AddVendorDialog from "@/components/admin/add-vendor-dialog"
import { authFetch } from "@/lib/utils"
import { showToast } from "@/components/ui/toast-provider"

function VendorCard({
  vendor,
  onToggleStatus,
}: {
  vendor: Vendor
  onToggleStatus: (vendor: Vendor) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)
    await onToggleStatus(vendor)
    setIsUpdating(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <img
                src={vendor.image || "/placeholder.svg"}
                alt={vendor.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{vendor.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{vendor.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={vendor.isOpen ? "default" : "secondary"}>{vendor.isOpen ? "Open" : "Closed"}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Cuisine: </span>
            <span className="font-medium">{vendor.cuisineType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Price Range: </span>
            <span className="font-medium">{vendor.priceRange}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Hours: </span>
            <span className="font-medium">
              {vendor.openingTime} - {vendor.closingTime}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Delivery Fee: </span>
            <span className="font-medium">${vendor.deliveryFee}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Switch checked={vendor.isOpen} onCheckedChange={handleToggle} disabled={isUpdating} />
            <span className="text-sm text-muted-foreground">{vendor.isOpen ? "Open" : "Closed"}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/vendors/${vendor.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/vendors/${vendor.id}?edit=1`}>
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

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  useEffect(() => {
    loadVendors()
  }, [])

  useEffect(() => {
    filterVendors()
  }, [vendors, searchTerm, statusFilter])

  const loadVendors = async () => {
    setIsLoading(true)
    try {
      console.log('Loading vendors...')
      const vendorsData = await getAdminVendors()
      console.log('Loaded vendors:', vendorsData)
      setVendors(vendorsData)
      console.log('Updated vendors list:', vendorsData)
    } catch (error) {
      console.error('Error loading vendors:', error)
      showToast('error', 'Failed to load vendors')
    } finally {
      setIsLoading(false)
    }
  }

  const filterVendors = () => {
    let filtered = vendors

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((vendor) => (statusFilter === "open" ? vendor.isOpen : !vendor.isOpen))
    }

    setFilteredVendors(filtered)
  }

  const handleToggleVendorStatus = async (vendor: Vendor) => {
    try {
      const updatedVendor = await updateVendorAvailability(vendor.id, !vendor.isOpen);
      if (updatedVendor) {
        setVendors(vendors.map((v) => (v.id === vendor.id ? updatedVendor : v)));
        showToast('success', `Vendor is now ${updatedVendor.isOpen ? 'Open' : 'Closed'}`);
      }
    } catch (e) {
      showToast('error', 'Failed to update vendor status');
    }
  };

  const handleAddVendor = async (vendor: { business_name: string; address: string; phone: string; cuisine_type: string; price_range: string; opening_time: string; closing_time: string; delivery_fee: string; email: string; password: string; }) => {
    const res = await authFetch("/api/admin/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(vendor),
    });
    
    let data: any = {};
    try {
      data = await res.json();
    } catch (e) {
      console.error("Failed to parse response:", e);
    }
    
    if (!res.ok) {
      // Handle different error response formats
      let errorMessage = "Failed to add vendor";
      if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (res.status === 422) {
        errorMessage = "Validation error: Please check your input data";
      } else if (res.status === 409) {
        errorMessage = "Vendor with this email already exists";
      } else if (res.status === 400) {
        errorMessage = "Invalid request data";
      }
      
      showToast('error', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Check for expected success response structure
    if (!data.vendor || !data.vendor.id) {
      const errorMessage = "Invalid response from server";
      showToast('error', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log("Vendor added successfully, refreshing list...");
    await loadVendors();
    showToast('success', `Vendor ${vendor.business_name} was added successfully.`);
    return { id: data.vendor.id };
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded flex-1" />
            <div className="h-10 bg-muted rounded w-32" />
          </div>
          <div className="grid gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded" />
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage restaurant partners</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>
      <AddVendorDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddVendor={handleAddVendor} />

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "open" | "closed")}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-sm text-muted-foreground">Total Vendors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{vendors.filter((v) => v.isOpen).length}</div>
            <p className="text-sm text-muted-foreground">Currently Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{vendors.filter((v) => !v.isOpen).length}</div>
            <p className="text-sm text-muted-foreground">Currently Closed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      {filteredVendors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No vendors found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onToggleStatus={handleToggleVendorStatus} />
          ))}
        </div>
      )}
    </div>
  )
}
