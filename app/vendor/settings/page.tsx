"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Store, Clock, Bell, CreditCard, Menu, Save, Upload, Copy, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function VendorSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const [businessInfo, setBusinessInfo] = useState({
    name: "Mary's Diner",
    description: "Classic American comfort food",
    phone: "(555) 123-4567",
    email: "contact@marysdiner.com",
    address: "123 Main St",
    city: "Rural Town",
    state: "ST",
    zipCode: "12345",
    cuisineType: "American",
    priceRange: "medium",
  })

  const [operatingHours, setOperatingHours] = useState({
    isOpen: true,
    monday: { open: "07:00", close: "21:00", isOpen: true },
    tuesday: { open: "07:00", close: "21:00", isOpen: true },
    wednesday: { open: "07:00", close: "21:00", isOpen: true },
    thursday: { open: "07:00", close: "21:00", isOpen: true },
    friday: { open: "07:00", close: "22:00", isOpen: true },
    saturday: { open: "08:00", close: "22:00", isOpen: true },
    sunday: { open: "08:00", close: "20:00", isOpen: true },
    specialHours: "",
  })

  const [menuSettings, setMenuSettings] = useState({
    autoAcceptOrders: true,
    preparationTime: 15,
    minOrderAmount: 10.0,
    deliveryFee: 3.99,
    allowScheduledOrders: true,
    maxScheduledDays: 3,
  })

  const [paymentInfo, setPaymentInfo] = useState({
    accountName: "Mary's Diner LLC",
    accountNumber: "****6789",
    routingNumber: "****4321",
    paymentMethod: "direct_deposit",
    taxId: "XX-XXXXXXX",
  })

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    payouts: true,
    reviews: true,
    news: false,
    email: true,
    push: true,
    sms: false,
  })

  const handleBusinessInfoChange = (field: string, value: string) => {
    setBusinessInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOperatingHoursChange = (day: string, field: string, value: any) => {
    if (day === "isOpen") {
      setOperatingHours((prev) => ({
        ...prev,
        isOpen: value,
      }))
    } else if (field === "isOpen") {
      setOperatingHours((prev) => ({
        ...prev,
        [day]: {
          ...prev[day as keyof typeof prev],
          isOpen: value,
        },
      }))
    } else {
      setOperatingHours((prev) => ({
        ...prev,
        [day]: {
          ...prev[day as keyof typeof prev],
          [field]: value,
        },
      }))
    }
  }

  const handleMenuSettingsChange = (field: string, value: any) => {
    setMenuSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const copyHoursToAllDays = (sourceDay: string) => {
    const sourceDayData = operatingHours[sourceDay as keyof typeof operatingHours]
    if (!sourceDayData || typeof sourceDayData !== "object") return

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const updatedHours = { ...operatingHours }

    days.forEach((day) => {
      if (day !== sourceDay) {
        updatedHours[day as keyof typeof updatedHours] = {
          ...updatedHours[day as keyof typeof updatedHours],
          open: sourceDayData.open,
          close: sourceDayData.close,
        }
      }
    })

    setOperatingHours(updatedHours)
    toast({
      title: "Hours copied",
      description: `Applied ${sourceDay}'s hours to all other days.`,
    })
  }

  const applyWeekdayWeekendHours = () => {
    const updatedHours = { ...operatingHours }

    // Set weekday hours (Monday-Friday)
    const weekdayOpen = "07:00"
    const weekdayClose = "21:00"

    // Set weekend hours (Saturday-Sunday)
    const weekendOpen = "08:00"
    const weekendClose = "22:00"[("monday", "tuesday", "wednesday", "thursday", "friday")]
      .forEach((day) => {
        updatedHours[day as keyof typeof updatedHours] = {
          ...updatedHours[day as keyof typeof updatedHours],
          open: weekdayOpen,
          close: weekdayClose,
        }
      })

      [("saturday", "sunday")].forEach((day) => {
        updatedHours[day as keyof typeof updatedHours] = {
          ...updatedHours[day as keyof typeof updatedHours],
          open: weekendOpen,
          close: weekendClose,
        }
      })

    setOperatingHours(updatedHours)
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
          <h1 className="text-2xl font-bold text-forest-green">Restaurant Settings</h1>
          <p className="text-muted-foreground">Manage your restaurant profile and preferences</p>
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
              operatingHours.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <motion.span
              className={`w-2 h-2 rounded-full ${operatingHours.isOpen ? "bg-green-500" : "bg-red-500"}`}
              animate={{ scale: operatingHours.isOpen ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: operatingHours.isOpen ? Number.POSITIVE_INFINITY : 0, repeatDelay: 1 }}
            ></motion.span>
            {operatingHours.isOpen ? "Open" : "Closed"}
          </div>
          <Switch
            checked={operatingHours.isOpen}
            onCheckedChange={(checked) => handleOperatingHoursChange("isOpen", "", checked)}
            className="data-[state=checked]:bg-forest-green"
          />
        </motion.div>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="grid grid-cols-5 h-auto bg-parchment">
          <TabsTrigger
            value="business"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-forest-green data-[state=active]:text-white"
          >
            <Store className="h-4 w-4 mb-1" />
            <span className="text-xs">Business</span>
          </TabsTrigger>
          <TabsTrigger
            value="hours"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-forest-green data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">Hours</span>
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-forest-green data-[state=active]:text-white"
          >
            <Menu className="h-4 w-4 mb-1" />
            <span className="text-xs">Menu</span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-forest-green data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4 mb-1" />
            <span className="text-xs">Payment</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex flex-col items-center py-2 px-4 data-[state=active]:bg-forest-green data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mb-1" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card className="border-forest-green/20">
            <CardHeader className="bg-parchment/30">
              <CardTitle className="text-forest-green">Business Information</CardTitle>
              <CardDescription>Update your restaurant details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Business info content - unchanged */}
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={businessInfo.name}
                  onChange={(e) => handleBusinessInfoChange("name", e.target.value)}
                  className="border-forest-green/20 focus-visible:ring-forest-green/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={businessInfo.description}
                  onChange={(e) => handleBusinessInfoChange("description", e.target.value)}
                  rows={3}
                  className="border-forest-green/20 focus-visible:ring-forest-green/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) => handleBusinessInfoChange("phone", e.target.value)}
                    className="border-forest-green/20 focus-visible:ring-forest-green/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => handleBusinessInfoChange("email", e.target.value)}
                    className="border-forest-green/20 focus-visible:ring-forest-green/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={businessInfo.address}
                  onChange={(e) => handleBusinessInfoChange("address", e.target.value)}
                  className="border-forest-green/20 focus-visible:ring-forest-green/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={businessInfo.city}
                    onChange={(e) => handleBusinessInfoChange("city", e.target.value)}
                    className="border-forest-green/20 focus-visible:ring-forest-green/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={businessInfo.state}
                    onChange={(e) => handleBusinessInfoChange("state", e.target.value)}
                    className="border-forest-green/20 focus-visible:ring-forest-green/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={businessInfo.zipCode}
                    onChange={(e) => handleBusinessInfoChange("zipCode", e.target.value)}
                    className="border-forest-green/20 focus-visible:ring-forest-green/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisineType">Cuisine Type</Label>
                  <select
                    id="cuisineType"
                    className="w-full p-2 border rounded-md border-forest-green/20 focus:ring-forest-green/30 focus:outline-none focus:ring-2"
                    value={businessInfo.cuisineType}
                    onChange={(e) => handleBusinessInfoChange("cuisineType", e.target.value)}
                  >
                    <option value="American">American</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Thai">Thai</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range</Label>
                  <select
                    id="priceRange"
                    className="w-full p-2 border rounded-md border-forest-green/20 focus:ring-forest-green/30 focus:outline-none focus:ring-2"
                    value={businessInfo.priceRange}
                    onChange={(e) => handleBusinessInfoChange("priceRange", e.target.value)}
                  >
                    <option value="low">$ - Budget Friendly</option>
                    <option value="medium">$$ - Moderate</option>
                    <option value="high">$$$ - Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Restaurant Photos</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <motion.div
                    className="border-2 border-dashed border-forest-green/20 rounded-md p-4 text-center"
                    whileHover={{ scale: 1.02, borderColor: "rgba(46, 125, 50, 0.5)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Upload className="h-8 w-8 mx-auto text-forest-green/60 mb-2" />
                    <p className="text-sm text-forest-green/80">Upload Logo</p>
                  </motion.div>
                  <motion.div
                    className="border-2 border-dashed border-forest-green/20 rounded-md p-4 text-center"
                    whileHover={{ scale: 1.02, borderColor: "rgba(46, 125, 50, 0.5)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Upload className="h-8 w-8 mx-auto text-forest-green/60 mb-2" />
                    <p className="text-sm text-forest-green/80">Upload Cover</p>
                  </motion.div>
                  <motion.div
                    className="border-2 border-dashed border-forest-green/20 rounded-md p-4 text-center"
                    whileHover={{ scale: 1.02, borderColor: "rgba(46, 125, 50, 0.5)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Upload className="h-8 w-8 mx-auto text-forest-green/60 mb-2" />
                    <p className="text-sm text-forest-green/80">Add Photo</p>
                  </motion.div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("business")}
                    disabled={isLoading}
                    className="bg-forest-green hover:bg-forest-green/90 text-white"
                  >
                    {saveSuccess === "business" ? (
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

        <TabsContent value="hours">
          <Card className="border-forest-green/20">
            <CardHeader className="bg-parchment/30">
              <CardTitle className="text-forest-green">Operating Hours</CardTitle>
              <CardDescription>Set your restaurant's operating schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between mb-4">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyWeekdayWeekendHours}
                    className="border-forest-green/20 text-forest-green hover:bg-forest-green/10"
                  >
                    Apply Standard Hours
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Global Status:</span>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                      operatingHours.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${operatingHours.isOpen ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    {operatingHours.isOpen ? "Open" : "Closed"}
                  </div>
                  <Switch
                    checked={operatingHours.isOpen}
                    onCheckedChange={(checked) => handleOperatingHoursChange("isOpen", "", checked)}
                    className="data-[state=checked]:bg-forest-green"
                  />
                </div>
              </div>

              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <motion.div
                  key={day}
                  className="flex items-center justify-between p-3 border rounded-md border-forest-green/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay:
                      ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(day) *
                      0.05,
                  }}
                  whileHover={{ backgroundColor: "rgba(46, 125, 50, 0.03)" }}
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={operatingHours[day as keyof typeof operatingHours]?.isOpen}
                      onCheckedChange={(checked) => handleOperatingHoursChange(day, "isOpen", checked)}
                      className="data-[state=checked]:bg-forest-green"
                    />
                    <Label className="capitalize font-medium w-20">{day}</Label>
                  </div>

                  {operatingHours[day as keyof typeof operatingHours]?.isOpen ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={operatingHours[day as keyof typeof operatingHours]?.open}
                        onChange={(e) => handleOperatingHoursChange(day, "open", e.target.value)}
                        className="w-32 border-forest-green/20 focus-visible:ring-forest-green/30"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={operatingHours[day as keyof typeof operatingHours]?.close}
                        onChange={(e) => handleOperatingHoursChange(day, "close", e.target.value)}
                        className="w-32 border-forest-green/20 focus-visible:ring-forest-green/30"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyHoursToAllDays(day)}
                        className="text-forest-green hover:bg-forest-green/10"
                        title={`Copy ${day}'s hours to all days`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </motion.div>
              ))}

              <div className="space-y-2 mt-4">
                <Label htmlFor="specialHours">Special Hours / Holiday Schedule</Label>
                <Textarea
                  id="specialHours"
                  value={operatingHours.specialHours}
                  onChange={(e) => setOperatingHours((prev) => ({ ...prev, specialHours: e.target.value }))}
                  placeholder="e.g., Closed on Christmas Day, Extended hours on New Year's Eve..."
                  rows={3}
                  className="border-forest-green/20 focus-visible:ring-forest-green/30"
                />
              </div>

              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("hours")}
                    disabled={isLoading}
                    className="bg-forest-green hover:bg-forest-green/90 text-white"
                  >
                    {saveSuccess === "hours" ? (
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

        <TabsContent value="menu">
          {/* Menu settings content - unchanged */}
          <Card className="border-forest-green/20">
            <CardHeader className="bg-parchment/30">
              <CardTitle className="text-forest-green">Menu Settings</CardTitle>
              <CardDescription>Configure your menu and order preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Menu settings content */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("menu")}
                    disabled={isLoading}
                    className="bg-forest-green hover:bg-forest-green/90 text-white"
                  >
                    {saveSuccess === "menu" ? (
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
          {/* Payment settings content - unchanged */}
          <Card className="border-forest-green/20">
            <CardHeader className="bg-parchment/30">
              <CardTitle className="text-forest-green">Payment Information</CardTitle>
              <CardDescription>Manage your payout methods and tax information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Payment settings content */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("payment")}
                    disabled={isLoading}
                    className="bg-forest-green hover:bg-forest-green/90 text-white"
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
          {/* Notifications settings content - unchanged */}
          <Card className="border-forest-green/20">
            <CardHeader className="bg-parchment/30">
              <CardTitle className="text-forest-green">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Notifications settings content */}
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => saveSettings("notifications")}
                    disabled={isLoading}
                    className="bg-forest-green hover:bg-forest-green/90 text-white"
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
