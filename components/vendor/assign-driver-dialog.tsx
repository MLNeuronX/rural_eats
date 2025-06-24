"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Star, MapPin, Clock, Truck } from "lucide-react"

interface Driver {
  id: string
  name: string
  rating: number
  distance: number
  estimatedTime: number
  phone: string
  isOnline: boolean
  completedDeliveries: number
  profileImage: string
}

interface AssignDriverDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  onDriverAssigned: (driverId: string, driverName: string) => void
}

// Mock driver data
const availableDrivers: Driver[] = [
  {
    id: "d1",
    name: "Mike Johnson",
    rating: 4.8,
    distance: 0.5,
    estimatedTime: 3,
    phone: "+1 (555) 123-4567",
    isOnline: true,
    completedDeliveries: 247,
    profileImage: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "d2",
    name: "Sarah Chen",
    rating: 4.9,
    distance: 1.2,
    estimatedTime: 5,
    phone: "+1 (555) 234-5678",
    isOnline: true,
    completedDeliveries: 189,
    profileImage: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "d3",
    name: "David Rodriguez",
    rating: 4.7,
    distance: 2.1,
    estimatedTime: 8,
    phone: "+1 (555) 345-6789",
    isOnline: true,
    completedDeliveries: 156,
    profileImage: "/placeholder.svg?height=40&width=40",
  },
]

export function AssignDriverDialog({ open, onOpenChange, orderId, onDriverAssigned }: AssignDriverDialogProps) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignmentStep, setAssignmentStep] = useState<"select" | "confirming" | "success">("select")

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver)
  }

  const handleAssignDriver = async () => {
    if (!selectedDriver) return

    setIsAssigning(true)
    setAssignmentStep("confirming")

    try {
      // Simulate API call to notify driver
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate driver acceptance (80% chance)
      const driverAccepts = Math.random() > 0.2

      if (driverAccepts) {
        setAssignmentStep("success")

        // Wait a moment to show success, then close
        setTimeout(() => {
          onDriverAssigned(selectedDriver.id, selectedDriver.name)
          onOpenChange(false)
          resetDialog()
        }, 2000)
      } else {
        // Driver declined
        setAssignmentStep("select")
        setSelectedDriver(null)
      }
    } catch (error) {
      setAssignmentStep("select")
    } finally {
      setIsAssigning(false)
    }
  }

  const resetDialog = () => {
    setSelectedDriver(null)
    setAssignmentStep("select")
    setIsAssigning(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            Assign Driver - Order #{orderId}
          </DialogTitle>
          <DialogDescription>
            {assignmentStep === "select" && "Select an available driver for this delivery"}
            {assignmentStep === "confirming" && "Waiting for driver confirmation..."}
            {assignmentStep === "success" && "Driver assigned successfully!"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {assignmentStep === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {availableDrivers.map((driver) => (
                <motion.div key={driver.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedDriver?.id === driver.id ? "ring-2 ring-emerald-500 bg-emerald-50" : "hover:shadow-md"
                    }`}
                    onClick={() => handleDriverSelect(driver)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={driver.profileImage || "/placeholder.svg"}
                            alt={driver.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{driver.name}</h3>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Online
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{driver.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{driver.distance} mi away</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>~{driver.estimatedTime} min</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-emerald-600">
                            ${(3.5 + driver.distance * 0.5).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">{driver.completedDeliveries} deliveries</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAssignDriver}
                  disabled={!selectedDriver || isAssigning}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isAssigning ? "Assigning..." : "Assign Selected Driver"}
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {assignmentStep === "confirming" && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Truck className="w-full h-full text-emerald-600" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">Contacting {selectedDriver?.name}...</h3>
              <p className="text-muted-foreground">We're notifying the driver about this delivery request.</p>
            </motion.div>
          )}

          {assignmentStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-emerald-600 text-2xl"
                >
                  ✓
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold mb-2 text-emerald-600">Driver Assigned!</h3>
              <p className="text-muted-foreground">
                {selectedDriver?.name} has accepted the delivery and will arrive in ~{selectedDriver?.estimatedTime}{" "}
                minutes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
