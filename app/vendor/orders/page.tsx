"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, MapPin, MessageCircle, CheckCircle, ChefHat, Package, Truck } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AssignDriverDialog } from "@/components/vendor/assign-driver-dialog"
import { authFetch } from "@/lib/utils"

// @ts-ignore
const statusMap = {
  PENDING: { label: "Pending", icon: Clock, color: "text-gray-500" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "text-blue-500" },
  READY: { label: "Ready", icon: Package, color: "text-orange-500" },
  ASSIGNED: { label: "Assigned", icon: Truck, color: "text-purple-500" },
  DELIVERING: { label: "Delivering", icon: Truck, color: "text-purple-500" },
  COMPLETED: { label: "Completed", icon: CheckCircle, color: "text-green-500" },
  CANCELED: { label: "Canceled", icon: ArrowLeft, color: "text-red-500" },
}

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [assignDriverDialog, setAssignDriverDialog] = useState<{
    open: boolean
    orderId: string | null
  }>({ open: false, orderId: null })

  const loadOrders = async () => {
    setLoading(true)
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
      const response = await authFetch(`${baseApiUrl}/api/vendor/orders`)
      if (!response.ok) {
        throw new Error(`