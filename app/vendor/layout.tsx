import * as React from "react"
import { VendorHeader } from "@/components/vendor/vendor-header"

// Simplify the vendor layout to remove authentication restrictions

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <VendorHeader />
      <main className="pb-6">{children}</main>
    </div>
  )
}
