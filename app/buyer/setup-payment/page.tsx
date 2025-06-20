"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SetupPaymentPage() {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate Stripe payment method creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payment method added!",
        description: "Your payment method has been securely saved.",
      })

      router.push("/buyer")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <Link href="/buyer">
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add Payment Method
            </CardTitle>
          </div>
          <CardDescription>Securely add your payment information to start ordering</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={paymentData.cardholderName}
                onChange={(e) => updateField("cardholderName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => updateField("expiryDate", formatExpiryDate(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => updateField("cvv", e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address</Label>
              <Input
                id="billingAddress"
                value={paymentData.billingAddress}
                onChange={(e) => updateField("billingAddress", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={paymentData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={paymentData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={paymentData.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <Shield className="h-4 w-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding Payment Method..." : "Add Payment Method"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
