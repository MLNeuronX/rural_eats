"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"

export default function VendorLogin() {
  const { switchRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Auto-switch to vendor role and redirect
    switchRole("vendor")
    router.push("/vendor")
  }, [switchRole, router])

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Store className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Vendor Portal</CardTitle>
          <CardDescription>Switching to vendor mode...</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => {
              switchRole("vendor")
              router.push("/vendor")
            }}
          >
            Continue to Vendor Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
