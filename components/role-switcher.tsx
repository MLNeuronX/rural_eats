"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { User, Store, Truck, Shield, X } from 'lucide-react'

const roleConfig = {
  buyer: {
    label: "Buyer",
    icon: User,
    color: "bg-blue-500",
    path: "/buyer",
    description: "Browse and order food",
  },
  vendor: {
    label: "Vendor",
    icon: Store,
    color: "bg-green-500",
    path: "/vendor",
    description: "Manage restaurant",
  },
  driver: {
    label: "Driver",
    icon: Truck,
    color: "bg-orange-500",
    path: "/driver",
    description: "Deliver orders",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "bg-purple-500",
    path: "/admin",
    description: "Platform management",
  },
}

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { role, switchRole } = useAuth()
  const router = useRouter()

  const handleRoleSwitch = (newRole: keyof typeof roleConfig) => {
    switchRole(newRole)
    router.push(roleConfig[newRole].path)
    setIsOpen(false)
  }

  const currentRole = role && roleConfig[role as keyof typeof roleConfig]
  const CurrentIcon = currentRole ? currentRole.icon : User

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        size="icon"
      >
        <CurrentIcon className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Switch Role</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {Object.entries(roleConfig).map(([roleKey, config]) => {
            const isActive = role === roleKey
            const Icon = config.icon

            return (
              <Button
                key={roleKey}
                variant={isActive ? "default" : "outline"}
                className="w-full justify-start gap-3 h-auto p-3"
                onClick={() => handleRoleSwitch(roleKey as keyof typeof roleConfig)}
              >
                <div className={`p-1 rounded ${config.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{config.label}</span>
                    {isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default RoleSwitcher
