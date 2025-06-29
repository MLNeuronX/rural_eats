"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ArrowLeft, DollarSign } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { getMenuItems, updateMenuItem, deleteMenuItem, type MenuItem } from "@/lib/data"
import { AddMenuItemDialog } from "@/components/vendor/add-menu-item-dialog"
import { EditMenuItemDialog } from "@/components/vendor/edit-menu-item-dialog"
import { authFetch } from "@/lib/utils"

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { user } = useAuth()
  const [vendorId, setVendorId] = useState<string>("")

  useEffect(() => {
    const fetchVendorProfile = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setIsLoading(false);
          return;
        }

        const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
        console.log("Fetching vendor profile from:", `${baseApiUrl}/api/vendor/profile`);
        
        const res = await fetch(`${baseApiUrl}/api/vendor/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("Vendor profile data:", data);
          setVendorId(data.vendor.id);
          await loadMenuItems(data.vendor.id);
        } else {
          console.error("Failed to fetch vendor profile:", res.status, res.statusText);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
        setIsLoading(false);
        // Show user-friendly error message
        alert("Unable to connect to server. Please check if the backend is running and try again.");
      }
    };
    
    fetchVendorProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadMenuItems = async (vId: string) => {
    try {
      const items = await getMenuItems(vId)
      setMenuItems(items)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updatedItem = await updateMenuItem(item.id, {
        available: !item.available,
      });
      if (updatedItem) {
        setMenuItems((items) => items.map((i) => (i.id === item.id ? updatedItem : i)));
      }
    } catch (e) {}
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }
    try {
      const success = await deleteMenuItem(item.id);
      if (success) {
        setMenuItems((items) => items.filter((i) => i.id !== item.id));
      }
    } catch (e) {}
  };

  const handleItemAdded = (newItem: MenuItem) => {
    setMenuItems((items) => [...items, newItem])
    setShowAddDialog(false)
  }

  const handleItemUpdated = (updatedItem: MenuItem) => {
    setMenuItems((items) => items.map((i) => (i.id === updatedItem.id ? updatedItem : i)))
    setEditingItem(null)
  }

  // Group items by category
  const categories = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/vendor">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">Manage your restaurant's menu items</p>
          </div>
        </div>

        <Button onClick={() => setShowAddDialog(true)} disabled={!vendorId}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {Object.keys(categories).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <DollarSign className="h-12 w-12 mx-auto mb-2" />
              <p>No menu items yet</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} disabled={!vendorId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <Badge variant={item.available ? "default" : "secondary"}>
                              {item.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <p className="font-medium text-lg">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Available</span>
                            <Switch checked={item.available} onCheckedChange={() => handleToggleAvailability(item)} />
                          </div>

                          <Button variant="outline" size="icon" onClick={() => setEditingItem(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteItem(item)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMenuItemDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onItemAdded={handleItemAdded} 
        vendorId={vendorId} // Use vendor ID from profile
      />

      {editingItem && (
        <EditMenuItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onItemUpdated={handleItemUpdated}
        />
      )}
    </div>
  )
}
