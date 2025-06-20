"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { MenuItem } from "@/lib/data"

interface CartItem {
  menuItem: MenuItem
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  vendorId: string | null
  addItem: (menuItem: MenuItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [vendorId, setVendorId] = useState<string | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ruralEatsCart")
    const savedVendorId = localStorage.getItem("ruralEatsVendorId")

    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    if (savedVendorId) {
      setVendorId(savedVendorId)
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("ruralEatsCart", JSON.stringify(items))

    if (vendorId) {
      localStorage.setItem("ruralEatsVendorId", vendorId)
    }
  }, [items, vendorId])

  const addItem = (menuItem: MenuItem) => {
    // If cart is empty, set the vendorId
    if (items.length === 0) {
      setVendorId(menuItem.vendorId)
    }

    // Check if adding from a different vendor
    if (vendorId && menuItem.vendorId !== vendorId) {
      if (!window.confirm("Adding items from a different restaurant will clear your current cart. Continue?")) {
        return
      }

      // Clear cart and set new vendorId
      setItems([])
      setVendorId(menuItem.vendorId)
    }

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.menuItem.id === menuItem.id)

      if (existingItemIndex >= 0) {
        // Increment quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Add new item with quantity 1
        return [...prevItems, { menuItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (menuItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.menuItem.id !== menuItemId))

    // If cart becomes empty, reset vendorId
    if (items.length === 1 && items[0].menuItem.id === menuItemId) {
      setVendorId(null)
    }
  }

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.menuItem.id === menuItemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setVendorId(null)
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        vendorId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
