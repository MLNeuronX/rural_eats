"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Truck } from "lucide-react"
import { showToast } from "@/components/ui/toast-provider"
import { authFetch } from "@/lib/utils"

interface AutoAssignButtonProps {
  orderId: string
  onDriverAssigned: (driverId: string, driverName: string) => void
  disabled?: boolean
}

export function AutoAssignButton({ orderId, onDriverAssigned, disabled }: AutoAssignButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAutoAssign = async () => {
    setIsLoading(true)
    try {
      // First, get available drivers
      const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
      const driversResponse = await authFetch(`${baseApiUrl}/api/vendor/available-drivers`);
      
      if (!driversResponse.ok) {
        throw new Error('Failed to fetch available drivers');
      }
      
      const driversData = await driversResponse.json();
      const availableDrivers = driversData.drivers || [];
      
      if (availableDrivers.length === 0) {
        showToast('error', 'No drivers available at the moment');
        return;
      }
      
      // Auto-assign the first available driver (or implement more sophisticated logic)
      const selectedDriver = availableDrivers[0];
      
      // Assign the driver to the order
      const assignResponse = await authFetch(`${baseApiUrl}/api/vendor/orders/${orderId}/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driver_id: selectedDriver.id })
      });
      
      if (assignResponse.ok) {
        const result = await assignResponse.json();
        onDriverAssigned(selectedDriver.id, selectedDriver.name || selectedDriver.first_name);
        showToast('success', `Auto-assigned driver: ${selectedDriver.name || selectedDriver.first_name}`);
      } else {
        const error = await assignResponse.json();
        throw new Error(error.error || 'Failed to assign driver');
      }
      
    } catch (error: any) {
      console.error('Auto-assign error:', error);
      showToast('error', error.message || 'Failed to auto-assign driver');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAutoAssign}
      disabled={disabled || isLoading}
      variant="outline"
      className="border-green-200 text-green-700 hover:bg-green-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Assigning...
        </>
      ) : (
        <>
          <Truck className="h-4 w-4 mr-2" />
          Auto-Assign Driver
        </>
      )}
    </Button>
  )
}