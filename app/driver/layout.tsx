import * as React from "react"
import { DriverHeader } from "@/components/driver/driver-header"

// Simplify the driver layout to remove authentication restrictions

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DriverHeader />
      <main className="pb-6">{children}</main>
    </div>
  )
}
