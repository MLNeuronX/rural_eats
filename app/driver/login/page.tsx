"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"

export default function DriverLogin() {
  const { switchRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Auto-switch to driver role and redirect
    switchRole("driver")
    router.push("/driver")
  }, [switchRole, router])

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Driver Portal</CardTitle>
          <CardDescription>Switching to driver mode...</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => {
              switchRole("driver")
              router.push("/driver")
            }}
          >
            Continue to Driver Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
