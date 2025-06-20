"use client"

import type React from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation"

interface VendorLayoutProps {
  children: React.ReactNode
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "vendor") {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (optional) */}
      <div className="w-64 bg-gray-200 p-4">
        {/* Add vendor-specific navigation here */}
        <h2 className="text-lg font-semibold mb-4">Vendor Dashboard</h2>
        <ul>
          <li>
            <a href="/vendor/products" className="block py-2 hover:bg-gray-300">
              Products
            </a>
          </li>
          <li>
            <a href="/vendor/orders" className="block py-2 hover:bg-gray-300">
              Orders
            </a>
          </li>
          {/* Add more vendor-specific links */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
