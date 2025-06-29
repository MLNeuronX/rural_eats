import * as React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

// Simplify the admin layout to remove authentication restrictions

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:pl-64">{children}</main>
    </div>
  )
}
