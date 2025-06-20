"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCog } from "lucide-react"

export default function AdminLogin() {
  const { switchRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Auto-switch to admin role and redirect
    switchRole("admin")
    router.push("/admin")
  }, [switchRole, router])

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserCog className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Admin Portal</CardTitle>
          <CardDescription>Switching to admin mode...</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => {
              switchRole("admin")
              router.push("/admin")
            }}
          >
            Continue to Admin Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
