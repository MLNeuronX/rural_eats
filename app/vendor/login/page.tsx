"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { loginVendor } from "@/app/vendor/api-calls"

export default function VendorLogin() {
  const router = useRouter()
  const { setCurrentUser } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const data = await loginVendor(email, password)
      // Save JWT token
      localStorage.setItem("vendor_token", data.access_token || data.token)
      // Optionally set user info in store if returned
      // setCurrentUser({ ... })
      router.push("/vendor/menu")
    } catch (err: any) {
      setError(err?.error || err?.message || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Store className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Vendor Portal Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the vendor portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
