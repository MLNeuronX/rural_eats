"use client"

import * as React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { showToast } from "@/components/ui/toast-provider"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return
    }

    if (!formData.agreeToTerms) {
      return
    }

    if (role === "driver" && !formData.agreeToBackground) {
      return
    }

    setIsLoading(true)

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com"
    // Ensure baseApiUrl doesn't end with /api to prevent double /api/api/ issue
    const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;

    try {
      let requestData;
      let endpoint;

      if (role === "vendor") {
        endpoint = `${cleanBaseUrl}/api/vendor/register`;
        requestData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          business_name: formData.businessName,
          address: formData.businessAddress,
          business_type: formData.businessType,
        };
      } else if (role === "driver") {
        endpoint = `${cleanBaseUrl}/api/driver/register`;
        requestData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        };
      } else { // buyer
        endpoint = `${cleanBaseUrl}/api/buyer/register`;
        requestData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        };
      }
      
      console.log(`Sending ${role} registration data to ${endpoint}:`, requestData)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Success response:", data);

        if (role === "vendor") {
          sessionStorage.setItem('vendorApplicationId', data.application_id);
          router.push("/vendor/application-submitted");
        } else {
           // For buyer and driver, we might want to log them in directly
           // For now, just show a success message and redirect
          if (role === "driver") {
            showToast('success', "Signup successful! Welcome, Driver.")
          }
          if (role === "buyer") {
            showToast('success', "Signup successful! Welcome, Buyer.")
          }
          router.push("/login");
        }
      } else {
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        console.log("Error response parsed:", errorData);
        if (role === "driver" || role === "buyer") {
          showToast('error', errorData.error || `HTTP ${response.status}: An unknown error occurred`)
        }
        throw new Error(errorData.error || `HTTP ${response.status}: An unknown error occurred`);
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (role === "driver" || role === "buyer") {
        showToast('error', "An error occurred. Please try again.")
      }
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
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => updateField("agreeToTerms", !!checked)}
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the Terms of Service and Privacy Policy
            </Label>
          </div>

          {role === "driver" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToBackground"
                checked={formData.agreeToBackground}
                onCheckedChange={(checked) => updateField("agreeToBackground", !!checked)}
              />
              <Label htmlFor="agreeToBackground" className="text-sm">
                I consent to a background check
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
