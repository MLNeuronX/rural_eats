"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface RegisterFormProps {
  role: "buyer" | "vendor" | "driver"
  title: string
}

export function RegisterForm({ role, title }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "", // For vendors
    businessAddress: "", // For vendors
    businessType: "", // For vendors
    agreeToTerms: false,
    agreeToBackground: false, // For drivers
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    if (role === "driver" && !formData.agreeToBackground) {
      toast({
        title: "Background check required",
        description: "Please agree to the background check for driver registration",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (role === "vendor") {
        // Send vendor application to backend
        const response = await fetch('http://localhost:5000/api/vendor/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            business_name: formData.businessName,
            address: formData.businessAddress,
            business_type: formData.businessType,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          // Store application ID for the submitted page
          sessionStorage.setItem('vendorApplicationId', data.application_id)
          toast({
            title: "Application submitted successfully!",
            description: `Your application ID is ${data.application_id}. You'll receive an email within 24-48 hours.`,
          })
          router.push("/vendor/application-submitted")
        } else {
          const error = await response.json()
          throw new Error(error.error || 'Failed to submit application')
        }
      } else {
        // For other roles, keep the existing mock behavior for now
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast({
          title: "Registration successful!",
          description:
            role === "driver"
              ? "Please complete your driver onboarding process."
              : "Welcome to Rural Drop! Please set up your payment method.",
        })

        if (role === "driver") {
          router.push("/driver/onboarding")
        } else {
          router.push("/buyer/setup-payment")
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Link href="/" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          {role === "vendor"
            ? "Apply to become a restaurant partner"
            : role === "driver"
              ? "Join as a delivery driver"
              : "Create your buyer account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />
          </div>

          {role === "vendor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => updateField("businessAddress", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <select
                  id="businessType"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={formData.businessType}
                  onChange={(e) => updateField("businessType", e.target.value)}
                  required
                >
                  <option value="">Select business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="bakery">Bakery</option>
                  <option value="food-truck">Food Truck</option>
                  <option value="catering">Catering</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => updateField("agreeToTerms", checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms and Conditions
              </Link>
            </Label>
          </div>

          {role === "driver" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="background"
                checked={formData.agreeToBackground}
                onCheckedChange={(checked) => updateField("agreeToBackground", checked as boolean)}
              />
              <Label htmlFor="background" className="text-sm">
                I consent to background check and vehicle verification
              </Label>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {role === "vendor" ? "Submitting Application..." : "Creating Account..."}
              </>
            ) : role === "vendor" ? (
              "Submit Application"
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
