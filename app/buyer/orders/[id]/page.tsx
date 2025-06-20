"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, CheckCircle, Truck, Package, ChefHat } from "lucide-react"
import Link from "next/link"
import { useAppStore, type OrderStatus } from "@/lib/store"
import { useNotifications } from "@/components/notifications/notification-provider"

const statusSteps: { status: OrderStatus; label: string; icon: any; description: string }[] = [
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle, description: "Restaurant confirmed your order" },
  { status: "PREPARING", label: "Preparing", icon: ChefHat, description: "Your food is being prepared" },
  { status: "READY", label: "Ready", icon: Package, description: "Order is ready for pickup" },
  { status: "OUT_FOR_DELIVERY", label: "On The Way", icon: Truck, description: "Driver is delivering your order" },
  { status: "DELIVERED", label: "Delivered", icon: CheckCircle, description: "Order has been delivered" },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const { showToast } = useNotifications()
  const { getOrderById, getVendorById, drivers } = useAppStore()

  const [order, setOrder] = useState(() => getOrderById(orderId))
  const [estimatedTime, setEstimatedTime] = useState("25-35 min")

  const vendor = order ? getVendorById(order.vendorId) : null
  const driver = order?.driverId ? drivers.find((d) => d.id === order.driverId) : null

  // Simulate real-time order updates
  useEffect(() => {
    if (!order) return

    const interval = setInterval(() => {
      const updatedOrder = getOrderById(orderId)
      if (updatedOrder && updatedOrder.status !== order.status) {
        setOrder(updatedOrder)

        // Show status update notification
        const statusStep = statusSteps.find((step) => step.status === updatedOrder.status)
        if (statusStep) {
          showToast({
            title: "Order Status Updated",
            message: statusStep.description,
            type: "info",
          })
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [order, orderId, getOrderById, showToast])

  if (!order) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Order Not Found</h1>
        <Link href="/buyer/orders">
          <Button className="buyer-gradient text-white">View All Orders</Button>
        </Link>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex((step) => step.status === order.status)
  const isCompleted = order.status === "DELIVERED"

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PREPARING":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "READY":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-buyer-background">
      <div className="container max-w-md mx-auto px-4 py-6">
        <motion.div className="flex items-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/buyer/orders">
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
        </motion.div>

        {/* Order Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-800">Order Status</CardTitle>
                <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Estimated Time */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Estimated delivery: {estimatedTime}</span>
                  </div>
                )}

                {/* Progress Steps */}
                <div className="space-y-3">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const StepIcon = step.icon

                    return (
                      <motion.div
                        key={step.status}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${isActive ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"}
                          ${isCurrent ? "ring-4 ring-amber-200" : ""}
                        `}
                        >
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isActive ? "text-gray-800" : "text-gray-400"}`}>{step.label}</p>
                          <p className={`text-sm ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                            {step.description}
                          </p>
                        </div>
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            className="w-2 h-2 bg-amber-500 rounded-full"
                          />
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Restaurant Info */}
        {vendor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img
                    src={vendor.image || "/placeholder.svg"}
                    alt={vendor.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{vendor.address}</span>
                    </div>
                  </div>
                  <a href={`tel:${vendor.phone}`}>
                    <Button variant="outline" size="sm" className="border-amber-200">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Driver Info */}
        {driver && order.status !== "DELIVERED" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Your Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img
                    src={driver.profileImage || "/placeholder.svg"}
                    alt={driver.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{driver.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⭐ {driver.rating}</span>
                      <span>•</span>
                      <span>{driver.vehicleType}</span>
                      {driver.estimatedArrival && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-medium">Arrives in {driver.estimatedArrival}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${driver.phone}`}>
                      <Button variant="outline" size="sm" className="border-amber-200">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={`sms:${driver.phone}`}>
                      <Button variant="outline" size="sm" className="border-amber-200">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">
                      {item.quantity}x {item.name}
                    </span>
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-500">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t border-amber-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${(order.total - order.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span className="buyer-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isCompleted && <Button className="w-full buyer-gradient text-white">Reorder Items</Button>}

          <Link href="/buyer/orders">
            <Button variant="outline" className="w-full border-amber-200 text-gray-700">
              View All Orders
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
