"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Truck, Star } from "lucide-react"
import { showToast } from "@/components/ui/toast-provider"
import { authFetch } from "@/lib/utils"

interface Driver {
  id: string
  name: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  rating?: number
  is_available: boolean
  current_location?: string
}

interface AssignDriverDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  onDriverAssigned: (driverId: string, driverName: string) => void
}

export function AssignDriverDialog({ open, onOpenChange, orderId, onDriverAssigned }: AssignDriverDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAssigning, setIsAssigning] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchAvailableDrivers()
    }
  }, [open])

  const fetchAvailableDrivers = async () => {
    setIsLoading(true)
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
      const response = await authFetch(`${baseApiUrl}/api/vendor/available-drivers`);
      
      if (response.ok) {
        const data = await response.json();
        setDrivers(data.drivers || []);
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Failed to fetch drivers');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      showToast.error('Failed to fetch available drivers');
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignDriver = async (driver: Driver) => {
    setIsAssigning(driver.id)
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
      const response = await authFetch(`${baseApiUrl}/api/vendor/orders/${orderId}/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ driver_id: driver.id })
      });

      if (response.ok) {
        const result = await response.json();
        const driverName = driver.name || `${driver.first_name} ${driver.last_name}`.trim();
        onDriverAssigned(driver.id, driverName);
        onOpenChange(false);
        showToast.success(`Driver ${driverName} assigned successfully!`);
      } else {
        const error = await response.json();
        showToast.error(error.error || 'Failed to assign driver');
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      showToast.error('Failed to assign driver');
    } finally {
      setIsAssigning(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Assign Driver
          </DialogTitle>
          <DialogDescription>
            Select a driver to assign to this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading drivers...</span>
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No drivers available at the moment
            </div>
          ) : (
            <div className="space-y-3">
              {drivers.map((driver) => (
                <Card key={driver.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {driver.name ? driver.name.charAt(0).toUpperCase() : 
                             driver.first_name ? driver.first_name.charAt(0).toUpperCase() : 'D'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {driver.name || `${driver.first_name} ${driver.last_name}`.trim()}
                          </p>
                          <p className="text-sm text-muted-foreground">{driver.email}</p>
                          {driver.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{driver.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                <Button
                          size="sm"
                          onClick={() => handleAssignDriver(driver)}
                          disabled={isAssigning === driver.id}
                        >
                          {isAssigning === driver.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Assign'
                          )}
                </Button>
              </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
