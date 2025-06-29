import * as React from "react"
import { BuyerBottomNav } from "@/components/buyer/bottom-nav"
import { CartProvider } from "@/components/buyer/cart-provider"

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen pb-16">
        {children}
        <BuyerBottomNav />
      </div>
    </CartProvider>
  )
}
