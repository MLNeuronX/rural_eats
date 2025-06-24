"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Truck, Loader2 } from "lucide-react"
import { showToast } from "@/components/ui/toast-provider"
import { authFetch } from "@/lib/utils"

interface AutoAssignButtonProps {
  orderId: string
  onDriverAssigned: (driver: any) => void
  disabled?: boolean
}

export function AutoAssignButton({ orderId, onDriverAssigned, disabled }: AutoAssignButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAutoAssign = async () => {
    setIsLoading(true)
    
    try {
      const response = await authFetch(`/api/order/auto-assign-driver/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        showToast.success(`Driver ${data.driver.name} assigned successfully!`)
        onDriverAssigned(data.driver)
      } else {
        const error = await response.json()
        showToast.error(error.error || 'Failed to assign driver')
      }
    } catch (error) {
      showToast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAutoAssign} 
      disabled={isLoading || disabled}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Truck className="h-4 w-4 mr-2" />
      )}
      {isLoading ? 'Finding Driver...' : 'Auto Assign Driver'}
    </Button>
  )
} 