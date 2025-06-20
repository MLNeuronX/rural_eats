"use client"

import type React from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-200 p-4">
        {/* Admin navigation */}
        <ul>
          <li>
            <a href="/admin">Dashboard</a>
          </li>
          <li>
            <a href="/admin/users">Users</a>
          </li>
          {/* Add more admin links here */}
        </ul>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
