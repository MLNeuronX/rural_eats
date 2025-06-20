"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, CreditCard, Truck } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { useNotifications } from "@/components/notifications/notification-provider"

export default function CheckoutPage() {
  const router = useRouter()
  const { showToast } = useNotifications()
  const { cart, vendorId, getCartTotal, getVendorById, clearCart, createOrder, currentUser } = useAppStore()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    deliveryAddress: currentUser?.address || "",
    phone: currentUser?.phone || "",
    specialInstructions: "",
    paymentMethod: "card",
  })

  const vendor = vendorId ? getVendorById(vendorId) : null
  const subtotal = getCartTotal()
  const deliveryFee = vendor?.deliveryFee || 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser || !vendor || cart.length === 0) {
      showToast({
        title: "Error",
        message: "Please check your cart and try again",
        type: "error",
      })
      return
    }

    if (!formData.deliveryAddress || !formData.phone) {
      showToast({
        title: "Missing Information",
        message: "Please fill in all required fields",
        type: "warning",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const order = createOrder({
        buyerId: currentUser.id,
        vendorId: vendor.id,
        items: cart.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        status: "NEW",
        total,
        deliveryFee,
        deliveryAddress: formData.deliveryAddress,
        vendorName: vendor.name,
        buyerName: currentUser.name,
        buyerPhone: formData.phone,
        estimatedDeliveryTime: vendor.estimatedDeliveryTime,
      })

      clearCart()

      showToast({
        title: "Order Placed Successfully!",
        message: `Your order #${order.id} is being prepared`,
        type: "success",
      })

      router.push(`/buyer/orders/${order.id}`)
    } catch (error) {
      showToast({
        title: "Order Failed",
        message: "There was a problem placing your order. Please try again.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="py-12">
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link href="/buyer">
            <Button className="buyer-gradient text-white">Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-buyer-background">
      <div className="container max-w-md mx-auto px-4 py-6">
        <motion.div className="flex items-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/buyer/cart">
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Restaurant Info */}
          {vendor && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={vendor.image || "/placeholder.svg"}
                      alt={vendor.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.address}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{vendor.estimatedDeliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <span className="font-semibold text-gray-800">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-800">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">Total</span>
                    <span className="buyer-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-gray-700">
                    Delivery Address *
                  </Label>
                  <Input
                    id="address"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter your full address"
                    className="mt-1 border-amber-200 focus:ring-amber-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                    className="mt-1 border-amber-200 focus:ring-amber-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-gray-700">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special delivery instructions..."
                    className="mt-1 border-amber-200 focus:ring-amber-400"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Method */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border border-amber-200 rounded-lg bg-amber-50">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-800">Credit/Debit Card</span>
                  <span className="ml-auto text-sm text-gray-500">•••• 4242</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Place Order Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full buyer-gradient text-white py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Order...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Place Order - ${total.toFixed(2)}
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
