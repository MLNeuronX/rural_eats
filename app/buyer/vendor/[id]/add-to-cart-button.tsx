"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCart } from "@/components/buyer/cart-provider"
import type { MenuItem } from "@/lib/data"

export function AddToCartButton({
  menuItem,
  disabled,
}: {
  menuItem: MenuItem
  disabled?: boolean
}) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem(menuItem)

      setIsAdding(false)
    }, 300)
  }

  return (
    <Button size="icon" onClick={handleAddToCart} disabled={disabled || isAdding}>
      <Plus className="h-4 w-4" />
    </Button>
  )
}
