"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { LogOut, Truck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DriverHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          <span className="font-semibold">Driver Portal</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "secondary"} className="cursor-pointer" onClick={toggleOnlineStatus}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
