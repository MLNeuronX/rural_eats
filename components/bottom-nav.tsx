"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/buyer/cart-provider"

export function BuyerBottomNav() {
  const pathname = usePathname()
  const { items } = useCart()

  const routes = [
    {
      href: "/buyer",
      label: "Home",
      icon: Home,
      active: pathname === "/buyer",
    },
    {
      href: "/buyer/orders",
      label: "Orders",
      icon: ShoppingBag,
      active: pathname === "/buyer/orders",
    },
    {
      href: "/buyer/cart",
      label: "Cart",
      icon: ShoppingCart,
      active: pathname === "/buyer/cart",
      badge: items.length > 0 ? items.length : null,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t">
      <nav className="flex justify-around">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn("flex flex-col items-center py-2 px-4 text-muted-foreground", route.active && "text-primary")}
          >
            <div className="relative">
              <route.icon className="h-6 w-6" />
              {route.badge && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                  variant="destructive"
                >
                  {route.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1">{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
