"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Bell, CreditCard, Save, Trash2, Plus } from "lucide-react"

export default function BuyerSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [addresses, setAddresses] = useState([])

  const [paymentMethods, setPaymentMethods] = useState([])

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newRestaurants: false,
    reviews: true,
    email: true,
    push: true,
    sms: false,
  })

  const [preferences, setPreferences] = useState({
    defaultTip: 18,
    saveOrderHistory: true,
    shareLocation: true,
    marketingEmails: false,
  })

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({
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

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const setDefaultAddress = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  const setDefaultPayment = (id: number) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const removeAddress = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id))
  }

  const removePaymentMethod = (id: number) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
  }

  const saveSettings = async (section: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and information</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid grid-cols-4 h-auto">
          <TabsTrigger value="personal" className="flex flex-col items-center py-2 px-4">
            <User className="h-4 w-4 mb-1" />
            <span className="text-xs">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex flex-col items-center py-2 px-4">
            <MapPin className="h-4 w-4 mb-1" />
            <span className="text-xs">Addresses</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex flex-col items-center py-2 px-4">
            <CreditCard className="h-4 w-4 mb-1" />
            <span className="text-xs">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col items-center py-2 px-4">
            <Bell className="h-4 w-4 mb-1" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Preferences</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="defaultTip">Default Tip Percentage</Label>
                      <span className="text-sm font-medium">{preferences.defaultTip}%</span>
                    </div>
                    <Input
                      id="defaultTip"
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={preferences.defaultTip}
                      onChange={(e) => handlePreferenceChange("defaultTip", Number.parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="saveOrderHistory">Save Order History</Label>
                      <p className="text-xs text-muted-foreground">
                        Keep track of your past orders for easy reordering
                      </p>
                    </div>
                    <Switch
                      id="saveOrderHistory"
                      checked={preferences.saveOrderHistory}
                      onCheckedChange={(checked) => handlePreferenceChange("saveOrderHistory", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareLocation">Share Location</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow location sharing for better delivery experience
                      </p>
                    </div>
                    <Switch
                      id="shareLocation"
                      checked={preferences.shareLocation}
                      onCheckedChange={(checked) => handlePreferenceChange("shareLocation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Receive promotional emails and special offers</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("personal")} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Addresses</CardTitle>
              <CardDescription>Manage your saved delivery addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{address.label}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.address}, {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => setDefaultAddress(address.id)}>
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAddress(address.id)}
                          disabled={address.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("addresses")} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{method.brand.slice(0, 1)}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                          </p>
                        </div>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">Default</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => setDefaultPayment(method.id)}>
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePaymentMethod(method.id)}
                          disabled={method.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("payment")} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderUpdates">Order Updates</Label>
                      <p className="text-xs text-muted-foreground">Get notified about your order status</p>
                    </div>
                    <Switch
                      id="orderUpdates"
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promotions">Promotions & Deals</Label>
                      <p className="text-xs text-muted-foreground">Get notified about special offers and discounts</p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newRestaurants">New Restaurants</Label>
                      <p className="text-xs text-muted-foreground">Get notified when new restaurants join</p>
                    </div>
                    <Switch
                      id="newRestaurants"
                      checked={notifications.newRestaurants}
                      onCheckedChange={(checked) => handleNotificationChange("newRestaurants", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reviews">Review Reminders</Label>
                      <p className="text-xs text-muted-foreground">Get reminded to review your orders</p>
                    </div>
                    <Switch
                      id="reviews"
                      checked={notifications.reviews}
                      onCheckedChange={(checked) => handleNotificationChange("reviews", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Notification Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email"
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch
                      id="push"
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="sms"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("notifications")} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
