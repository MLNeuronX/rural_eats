"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, MapPin, MessageCircle, CheckCircle, ChefHat, Package, Truck } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { AssignDriverDialog } from "@/components/vendor/assign-driver-dialog"

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
      const response = await fetch("https://rural-eats-backend.onrender.com/api/vendor/orders")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Could not fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Vendor Orders</h1>
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              loadOrders={loadOrders}
              setAssignDriverDialog={setAssignDriverDialog}
            />
          ))}
        </div>
      )}
      <AssignDriverDialog
        open={assignDriverDialog.open}
        onOpenChange={(open) => setAssignDriverDialog({ open, orderId: open ? assignDriverDialog.orderId : null })}
        orderId={assignDriverDialog.orderId || ""}
        onDriverAssigned={() => {}}
      />
    </div>
  )
}

interface OrderCardProps {
  order: any
  loadOrders: () => Promise<void>
  setAssignDriverDialog: (dialogState: { open: boolean; orderId: string | null }) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, loadOrders, setAssignDriverDialog }) => {
  // @ts-ignore
  const { label, icon: StatusIcon, color } = statusMap[order.status as string]

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
          <Badge variant="secondary">
            <StatusIcon className={`h-4 w-4 mr-2 ${color}`} />
            {label}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="my-4">
        <p className="text-gray-600">
          <MapPin className="inline-block h-4 w-4 mr-1" /> {order.deliveryAddress}
        </p>
        <p className="text-gray-600">
          <MessageCircle className="inline-block h-4 w-4 mr-1" /> {order.customerNotes || "No notes"}
        </p>
      </div>

      <Separator />

      <div className="flex gap-2">
        <Link href={`/vendor/orders/${order.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {order.status === "READY" && !order.driverId && (
          <Button
            onClick={() => setAssignDriverDialog({ open: true, orderId: order.id })}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Truck className="h-4 w-4 mr-2" />
            Assign Driver
          </Button>
        )}
      </div>
    </div>
  )
}

export default VendorOrdersPage
