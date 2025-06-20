"use client"

import type React from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation"

export default function BuyerLayout({
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

  if (user.role !== "buyer") {
    redirect("/")
  }

  return <>{children}</>
}
