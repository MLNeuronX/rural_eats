"use client"

import * as React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMenuItem, type MenuItem } from "@/lib/data"

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded: (item: MenuItem) => void
  vendorId: string
}

const categories = [
  "Appetizers",
  "Burgers",
  "Entrees",
  "Pasta",
  "Pizzas",
  "Tacos",
  "Burritos",
  "Sandwiches",
  "Salads",
  "Desserts",
  "Drinks",
  "Sides",
]

export function AddMenuItemDialog({ open, onOpenChange, onItemAdded, vendorId }: AddMenuItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    const missingFields = [];
    if (!formData.name || formData.name.trim() === "") missingFields.push("Name");
    if (!formData.description || formData.description.trim() === "") missingFields.push("Description");
    if (!formData.price || formData.price.trim() === "") missingFields.push("Price");
    if (!formData.category || formData.category.trim() === "") missingFields.push("Category");
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    // Validate price format and value
    const price = Number.parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError("Price must be a valid number greater than zero")
      return
    }

    // Validate vendor ID
    if (!vendorId || vendorId.trim() === "") {
      setError("Vendor ID is missing. Please refresh the page and try again.")
      console.error("Vendor ID is missing when trying to create menu item")
      return
    }

    setIsLoading(true)

    try {
      console.log("Creating menu item with vendor ID:", vendorId)
      console.log("Menu item data:", {
        name: formData.name,
        description: formData.description,
        price: price,
        category: formData.category
      })
      
      const newItem = await createMenuItem({
        vendorId: vendorId.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        category: formData.category.trim(),
        image: "/placeholder.svg?height=100&width=100",
        available: true,
      })

      console.log("Menu item created successfully:", newItem)
      onItemAdded(newItem)

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
      })
      onOpenChange(false) // Close the dialog after successful creation
    } catch (error: any) {
      console.error("Error creating menu item:", error)
      // Display a more specific error message if available
      if (error?.message?.includes("Network error")) {
        setError("Network error: Please check your connection and ensure the server is running.")
      } else if (error?.message?.includes("401")) {
        setError("Authentication error: Please log in again.")
      } else if (error?.message?.includes("403")) {
        setError("Authorization error: You don't have permission to create menu items.")
      } else {
        setError(error?.message || "Failed to create menu item. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>Add a new item to your restaurant menu.</DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Classic Cheeseburger"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your menu item..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
