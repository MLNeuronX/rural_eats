"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { User, Car, Bell, CreditCard, Clock, Save, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { motion } from "framer-motion"

export default function DriverSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const [personalInfo, setPersonalInfo] = useState({
    name: "John Driver",
    email: "john.driver@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Rural Town",
    state: "ST",
    zipCode: "12345",
  })

  const [vehicleInfo, setVehicleInfo] = useState({
    type: "car",
    make: "Toyota",
    model: "Corolla",
    year: "2018",
    color: "Silver",
    licensePlate: "ABC123",
  })

  const [availability, setAvailability] = useState({
    status: "online", // online, offline, busy
    autoOffline: true,
    availableDays: {
      monday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      tuesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      wednesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      thursday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      friday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
      saturday: { isAvailable: false, startTime: "10:00", endTime: "16:00" },
      sunday: { isAvailable: false, startTime: "10:00", endTime: "16:00" },
    },
    maxDistance: 15,
    specialNotes: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    accountName: "John Driver",
    accountNumber: "****6789",
    routingNumber: "****4321",
    paymentMethod: "direct_deposit",
  })

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    earnings: true,
    news: false,
    email: true,
    push: true,
    sms: false,
  })

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleVehicleInfoChange = (field: string, value: string) => {
    setVehicleInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvailabilityChange = (field: string, value: any) => {
    if (field.startsWith("availableDays.")) {
      const [_, day, prop] = field.split(".")
      setAvailability((prev) => ({
        ...prev,
        availableDays: {
          ...prev.availableDays,
          [day]: {
            ...prev.availableDays[day as keyof typeof prev.availableDays],
            [prop]: value,
          },
        },
      }))
    } else {
      setAvailability((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const copyHoursToAllDays = (sourceDay: string) => {
    const sourceDayData = availability.availableDays[sourceDay as keyof typeof availability.availableDays]
    if (!sourceDayData) return

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const updatedAvailability = { ...availability }

    days.forEach((day) => {
      if (day !== sourceDay) {
        updatedAvailability.availableDays[day as keyof typeof updatedAvailability.availableDays] = {
          ...updatedAvailability.availableDays[day as keyof typeof updatedAvailability.availableDays],
          startTime: sourceDayData.startTime,
          endTime: sourceDayData.endTime,
        }
      }
    })

    setAvailability(updatedAvailability)
    toast({
      title: "Hours copied",
      description: `Applied ${sourceDay}'s hours to all other days.`,
    })
  }

  const applyWeekdayWeekendHours = () => {
    const updatedAvailability = { ...availability }

    // Set weekday hours (Monday-Friday)
    const weekdayStart = "09:00"
    const weekdayEnd = "17:00"

    // Set weekend hours (Saturday-Sunday)
    const weekendStart = "10:00"
    const weekendEnd = "16:00"[("monday", "tuesday", "wednesday", "thursday", "friday")]
      .forEach((day) => {
        updatedAvailability.availableDays[day as keyof typeof updatedAvailability.availableDays] = {
          ...updatedAvailability.availableDays[day as keyof typeof updatedAvailability.availableDays],
          startTime: weekdayStart,
          endTime: weekdayEnd,
          isAvailable: true,
        }
      })

      [("saturday", "sunday")].forEach((day) => {
        updatedAvailability.availableDays[day as keyof typeof updatedAvailability.availableDays] = {
          ...updatedAvailability.availableDays[day as keyof typeof updatedAvailability.availableDays],
          startTime: weekendStart,
          endTime: weekendEnd,
          isAvailable: false,
        }
      })

    setAvailability(updatedAvailability)
    toast({
      title: "Hours updated",
      description: "Applied standard weekday/weekend hours.",
    })
  }

  const saveSettings = async (section: string) => {
    setIsLoading(true)
    setSaveSuccess(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      setSaveSuccess(section)

      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated.`,
      })

      // Clear success indicator after animation completes
      setTimeout(() => setSaveSuccess(null), 2000)
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-electric-blue">Account Settings</h1>
          <p className="text-muted-foreground">Manage your driver profile and preferences</p>
        </div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
              availability.status === "online"
                ? "bg-green-100 text-green-800"
                : availability.status === "busy"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            <motion.span
              className={`w-2 h-2 rounded-full ${
                availability.status === "online"
                  ? "bg-green-500"
                  : availability.status === "busy"
                    ? "bg-amber-500"
                    : "bg-gray-500"
              }`}
              animate={{ scale: availability.status === "online" ? [1, 1.2, 1] : 1 }}
              transition={{
                duration: 1,
                repeat: availability.status === "online" ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 1,
              }}
            ></motion.span>
            {availability.status === "online" ? "Online" : availability.status === "busy" ? "Busy" : "Offline"}
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid grid-cols-5 h-auto bg-dark-slate/5">
          <TabsTrigger
            value="personal"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-electric-blue data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mb-1" />
            <span className="text-xs">Personal</span>
          </TabsTrigger>
          <TabsTrigger
            value="vehicle"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-electric-blue data-[state=active]:text-white"
          >
            <Car className="h-4 w-4 mb-1" />
            <span className="text-xs">Vehicle</span>
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-electric-blue data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">Availability</span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-electric-blue data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4 mb-1" />
            <span className="text-xs">Payment</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-electric-blue data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mb-1" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="border-electric-blue/20">
            <CardHeader className="bg-dark-slate/5">
              <CardTitle className="text-electric-blue">Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Personal info content - unchanged */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("personal")}
                    disabled={isLoading}
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                  >
                    {saveSuccess === "personal" ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </motion.span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card className="border-electric-blue/20">
            <CardHeader className="bg-dark-slate/5">
              <CardTitle className="text-electric-blue">Vehicle Information</CardTitle>
              <CardDescription>Update your vehicle details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Vehicle info content - unchanged */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("vehicle")}
                    disabled={isLoading}
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                  >
                    {saveSuccess === "vehicle" ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </motion.span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card className="border-electric-blue/20">
            <CardHeader className="bg-dark-slate/5">
              <CardTitle className="text-electric-blue">Availability Settings</CardTitle>
              <CardDescription>Manage your working hours and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="bg-dark-slate/5 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-electric-blue">Current Status</h3>
                    <p className="text-sm text-muted-foreground">Set your current availability</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={availability.status === "online" ? "default" : "outline"}
                      className={
                        availability.status === "online"
                          ? "bg-green-600"
                          : "border-electric-blue/20 text-electric-blue hover:bg-electric-blue/10"
                      }
                      onClick={() => handleAvailabilityChange("status", "online")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Online
                    </Button>
                    <Button
                      size="sm"
                      variant={availability.status === "offline" ? "default" : "outline"}
                      className={
                        availability.status === "offline"
                          ? "bg-gray-600"
                          : "border-electric-blue/20 text-electric-blue hover:bg-electric-blue/10"
                      }
                      onClick={() => handleAvailabilityChange("status", "offline")}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Offline
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoOffline">Auto Offline After Delivery</Label>
                  <p className="text-sm text-muted-foreground">Automatically go offline after completing a delivery</p>
                </div>
                <Switch
                  id="autoOffline"
                  checked={availability.autoOffline}
                  onCheckedChange={(checked) => handleAvailabilityChange("autoOffline", checked)}
                  className="data-[state=checked]:bg-electric-blue"
                />
              </div>

              <Separator />

              <div className="flex justify-between mb-4">
                <h3 className="font-medium text-electric-blue mb-2">Weekly Schedule</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyWeekdayWeekendHours}
                  className="border-electric-blue/20 text-electric-blue hover:bg-electric-blue/10"
                >
                  Apply Standard Hours
                </Button>
              </div>

              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <motion.div
                  key={day}
                  className="flex items-center justify-between p-3 border rounded-md border-electric-blue/20 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay:
                      ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(day) *
                      0.05,
                  }}
                  whileHover={{ backgroundColor: "rgba(3, 169, 244, 0.03)" }}
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={availability.availableDays[day as keyof typeof availability.availableDays]?.isAvailable}
                      onCheckedChange={(checked) =>
                        handleAvailabilityChange(`availableDays.${day}.isAvailable`, checked)
                      }
                      className="data-[state=checked]:bg-electric-blue"
                    />
                    <Label className="capitalize font-medium w-20">{day}</Label>
                  </div>

                  {availability.availableDays[day as keyof typeof availability.availableDays]?.isAvailable ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={availability.availableDays[day as keyof typeof availability.availableDays]?.startTime}
                        onChange={(e) => handleAvailabilityChange(`availableDays.${day}.startTime`, e.target.value)}
                        className="w-32 border-electric-blue/20 focus-visible:ring-electric-blue/30"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={availability.availableDays[day as keyof typeof availability.availableDays]?.endTime}
                        onChange={(e) => handleAvailabilityChange(`availableDays.${day}.endTime`, e.target.value)}
                        className="w-32 border-electric-blue/20 focus-visible:ring-electric-blue/30"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyHoursToAllDays(day)}
                        className="text-electric-blue hover:bg-electric-blue/10"
                        title={`Copy ${day}'s hours to all days`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unavailable</span>
                  )}
                </motion.div>
              ))}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxDistance">Maximum Delivery Distance</Label>
                  <span className="text-sm font-medium">{availability.maxDistance} miles</span>
                </div>
                <Input
                  id="maxDistance"
                  type="range"
                  min="1"
                  max="25"
                  value={availability.maxDistance}
                  onChange={(e) => handleAvailabilityChange("maxDistance", Number.parseInt(e.target.value))}
                  className="accent-electric-blue"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 mile</span>
                  <span>25 miles</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="specialNotes">Special Notes / Availability Exceptions</Label>
                <textarea
                  id="specialNotes"
                  value={availability.specialNotes}
                  onChange={(e) => handleAvailabilityChange("specialNotes", e.target.value)}
                  placeholder="e.g., Not available on July 4th, Available for extra hours during holidays..."
                  rows={3}
                  className="w-full p-2 border rounded-md border-electric-blue/20 focus:ring-electric-blue/30 focus:outline-none focus:ring-2"
                />
              </div>

              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("availability")}
                    disabled={isLoading}
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                  >
                    {saveSuccess === "availability" ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </motion.span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="border-electric-blue/20">
            <CardHeader className="bg-dark-slate/5">
              <CardTitle className="text-electric-blue">Payment Information</CardTitle>
              <CardDescription>Manage your payment methods and payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Payment info content - unchanged */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("payment")}
                    disabled={isLoading}
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                  >
                    {saveSuccess === "payment" ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </motion.span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-electric-blue/20">
            <CardHeader className="bg-dark-slate/5">
              <CardTitle className="text-electric-blue">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Notifications content - unchanged */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("notifications")}
                    disabled={isLoading}
                    className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                  >
                    {saveSuccess === "notifications" ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </motion.span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
