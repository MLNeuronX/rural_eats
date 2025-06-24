"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Save, Settings, Bell, DollarSign, Globe, Shield } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Rural Eats",
    supportEmail: "support@ruraleats.com",
    supportPhone: "(555) 123-4567",
    companyAddress: "123 Main St, Rural Town, State 12345",

    // Operational Settings
    defaultDeliveryFee: 3.99,
    minimumOrderAmount: 10.0,
    maxDeliveryRadius: 15,
    averageDeliveryTime: 30,

    // Commission Settings
    vendorCommission: 15,
    driverCommission: 80,
    platformFee: 0.3,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    systemAlerts: true,

    // Feature Flags
    allowGuestOrders: false,
    enableRatings: true,
    enablePromotions: true,
    enableScheduledDelivery: true,
    maintainanceMode: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => updateSetting("platformName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => updateSetting("supportEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={settings.supportPhone}
                  onChange={(e) => updateSetting("supportPhone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                value={settings.companyAddress}
                onChange={(e) => updateSetting("companyAddress", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operational Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Operational Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultDeliveryFee">Default Delivery Fee ($)</Label>
                <Input
                  id="defaultDeliveryFee"
                  type="number"
                  step="0.01"
                  value={settings.defaultDeliveryFee}
                  onChange={(e) => updateSetting("defaultDeliveryFee", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  step="0.01"
                  value={settings.minimumOrderAmount}
                  onChange={(e) => updateSetting("minimumOrderAmount", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDeliveryRadius">Max Delivery Radius (miles)</Label>
                <Input
                  id="maxDeliveryRadius"
                  type="number"
                  value={settings.maxDeliveryRadius}
                  onChange={(e) => updateSetting("maxDeliveryRadius", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="averageDeliveryTime">Average Delivery Time (minutes)</Label>
                <Input
                  id="averageDeliveryTime"
                  type="number"
                  value={settings.averageDeliveryTime}
                  onChange={(e) => updateSetting("averageDeliveryTime", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commission Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Commission & Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="vendorCommission">Vendor Commission (%)</Label>
                <Input
                  id="vendorCommission"
                  type="number"
                  step="0.1"
                  value={settings.vendorCommission}
                  onChange={(e) => updateSetting("vendorCommission", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Platform takes {settings.vendorCommission}% from vendor orders
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverCommission">Driver Share (%)</Label>
                <Input
                  id="driverCommission"
                  type="number"
                  step="0.1"
                  value={settings.driverCommission}
                  onChange={(e) => updateSetting("driverCommission", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Drivers get {settings.driverCommission}% of delivery fees
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platformFee">Platform Fee ($)</Label>
                <Input
                  id="platformFee"
                  type="number"
                  step="0.01"
                  value={settings.platformFee}
                  onChange={(e) => updateSetting("platformFee", Number.parseFloat(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Fixed fee per order</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send email notifications to users</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send SMS notifications to users</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send push notifications</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderAlerts">Order Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert staff about new orders</p>
                </div>
                <Switch
                  id="orderAlerts"
                  checked={settings.orderAlerts}
                  onCheckedChange={(checked) => updateSetting("orderAlerts", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Feature Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowGuestOrders">Guest Orders</Label>
                  <p className="text-xs text-muted-foreground">Allow orders without account</p>
                </div>
                <Switch
                  id="allowGuestOrders"
                  checked={settings.allowGuestOrders}
                  onCheckedChange={(checked) => updateSetting("allowGuestOrders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRatings">Ratings & Reviews</Label>
                  <p className="text-xs text-muted-foreground">Enable customer ratings</p>
                </div>
                <Switch
                  id="enableRatings"
                  checked={settings.enableRatings}
                  onCheckedChange={(checked) => updateSetting("enableRatings", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enablePromotions">Promotions</Label>
                  <p className="text-xs text-muted-foreground">Enable discount codes and promotions</p>
                </div>
                <Switch
                  id="enablePromotions"
                  checked={settings.enablePromotions}
                  onCheckedChange={(checked) => updateSetting("enablePromotions", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableScheduledDelivery">Scheduled Delivery</Label>
                  <p className="text-xs text-muted-foreground">Allow future delivery scheduling</p>
                </div>
                <Switch
                  id="enableScheduledDelivery"
                  checked={settings.enableScheduledDelivery}
                  onCheckedChange={(checked) => updateSetting("enableScheduledDelivery", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintainanceMode">Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground text-red-600">Disable platform for maintenance</p>
                </div>
                <Switch
                  id="maintainanceMode"
                  checked={settings.maintainanceMode}
                  onCheckedChange={(checked) => updateSetting("maintainanceMode", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
