"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/components/buyer/cart-provider"
import { getVendorById } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"

export default function CartPage() {
  const { items, vendorId, updateQuantity, removeItem, total, clearCart } = useCart()
  const [vendor, setVendor] = useState<any>(null)
  const [address, setAddress] = useState("")
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Fetch vendor details if we have a vendorId
  useState(() => {
    if (vendorId) {
      getVendorById(vendorId).then(setVendor)
    }
  })

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to complete your order",
        variant: "destructive",
      })
      return
    }

    // Navigate to checkout page instead of creating order directly
    router.push("/buyer/checkout")
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
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${(total + (vendor?.deliveryFee || 0)).toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full buyer-gradient text-white" onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
