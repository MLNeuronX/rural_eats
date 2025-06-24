"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Minus, Plus, Trash2, DollarSign } from "lucide-react"
import { useCart } from "@/components/buyer/cart-provider"
import { getVendorById, createOrder } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"

export default function CartPage() {
  const { items, vendorId, updateQuantity, removeItem, total, clearCart } = useCart()
  const [vendor, setVendor] = useState<any>(null)
  const [address, setAddress] = useState("")
  const [tip, setTip] = useState(0)
  const [customTip, setCustomTip] = useState("")
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Fetch vendor details if we have a vendorId
  useState(() => {
    if (vendorId) {
      getVendorById(vendorId).then(setVendor)
    }
  })

  const handleCheckout = async () => {
    if (!user) {
      return
    }

    if (!address) {
      return
    }

    setIsLoading(true)

    try {
      // Create order
      const order = await createOrder({
        buyerId: user.id,
        vendorId: vendorId!,
        driverId: null,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
        })),
        status: "NEW",
        total: total + tip,
        tip: tip,
        deliveryFee: vendor?.deliveryFee || 0,
        deliveryAddress: address,
        deliveryTime: deliveryTime,
      })

      // Clear cart
      clearCart()

      // Redirect to confirmation page
      router.push(`/buyer/orders/${order.id}`)
    } catch (error) {
      console.error("Error placing order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="py-12">
          <p className="text-muted-foreground mb-6">Your cart is empty</p>
          <Link href="/buyer">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/buyer">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {vendor && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-medium">{vendor.name}</h2>
                <p className="text-sm text-muted-foreground">{vendor.address}</p>
              </div>
              <Link href={`/buyer/vendor/${vendor.id}`}>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <Card key={item.menuItem.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.menuItem.name}</h3>
                  <p className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(item.menuItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Input
            id="address"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryTime">Delivery Time (Optional)</Label>
          <select
            id="deliveryTime"
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={deliveryTime || ""}
            onChange={(e) => setDeliveryTime(e.target.value || null)}
          >
            <option value="">As soon as possible</option>
            <option value="1 hour">In 1 hour</option>
            <option value="2 hours">In 2 hours</option>
            <option value="7pm">At 7:00 PM</option>
            <option value="8pm">At 8:00 PM</option>
          </select>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-semibold">Driver Tip</h3>
        <p className="text-sm text-muted-foreground">
          Your driver receives 100% of the tip. Thank you for your generosity!
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {[0, 2, 5, 8].map((presetTip) => (
            <Button
              key={presetTip}
              variant={tip === presetTip ? "default" : "outline"}
              onClick={() => {
                setTip(presetTip)
                setCustomTip("")
              }}
            >
              ${presetTip}
            </Button>
          ))}
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Custom"
              className="pl-7 w-28"
              value={customTip}
              onChange={(e) => {
                setCustomTip(e.target.value)
                setTip(Number(e.target.value) || 0)
              }}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${(vendor?.deliveryFee || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Driver Tip</span>
            <span>${tip.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${(total + (vendor?.deliveryFee || 0) + tip).toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <Button className="w-full" onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
