"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronUp, User, Store, Truck, Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const roleConfig = {
  buyer: {
    label: "Buyer",
    icon: User,
    color: "text-blue-600",
    path: "/buyer",
  },
  vendor: {
    label: "Vendor",
    icon: Store,
    color: "text-green-600",
    path: "/vendor",
  },
  driver: {
    label: "Driver",
    icon: Truck,
    color: "text-orange-600",
    path: "/driver",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "text-purple-600",
    path: "/admin",
  },
}

export function RoleSwitcher() {
  const { user, setRole } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const currentConfig = roleConfig[user.role]
  const CurrentIcon = currentConfig.icon

  const handleRoleChange = (newRole: keyof typeof roleConfig) => {
    setRole(newRole)
    router.push(roleConfig[newRole].path)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white/95 transition-all duration-200"
          >
            <CurrentIcon className={`h-4 w-4 mr-2 ${currentConfig.color}`} />
            <span className="text-sm font-medium">{currentConfig.label}</span>
            <ChevronUp className="h-3 w-3 ml-2 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
          {Object.entries(roleConfig).map(([roleKey, config]) => {
            const Icon = config.icon
            const isActive = user.role === roleKey

            return (
              <DropdownMenuItem
                key={roleKey}
                onClick={() => handleRoleChange(roleKey as keyof typeof roleConfig)}
                className={`cursor-pointer ${isActive ? "bg-gray-100" : ""}`}
              >
                <Icon className={`h-4 w-4 mr-2 ${config.color}`} />
                <span className="text-sm">{config.label}</span>
                {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-green-500" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
