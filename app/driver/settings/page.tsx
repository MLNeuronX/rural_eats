"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { showToast } from "@/components/ui/toast-provider"
import { User, Shield, Bell, Car, Trash2, Save } from "lucide-react"
import { authFetch } from "@/lib/utils"

interface DriverProfile {
  first_name: string
  last_name: string
  phone: string
  vehicle_details: string
  email: string
}

export default function DriverSettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newPassword, setNewPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const res = await authFetch("/api/driver/profile")
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setProfile(data.driver)
      } catch (e) {
        showToast('error', "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSaveChanges = async () => {
    if (!profile) return

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'phone', 'vehicle_details'] as const
    const missingFields = requiredFields.filter(field => !profile[field])
    if (missingFields.length > 0) {
      showToast('error', `Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    // Validate field lengths
    if (profile.first_name.length < 2 || profile.last_name.length < 2) {
      showToast('error', 'First and last name must be at least 2 characters long')
      return
    }
    if (profile.phone.length < 10) {
      showToast('error', 'Please enter a valid phone number')
      return
    }
    if (profile.vehicle_details.length < 5) {
      showToast('error', 'Please provide more details about your vehicle')
      return
    }

    setIsLoading(true)
    try {
      const res = await authFetch("/api/driver/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update profile')
      }
      
      showToast('success', "Profile updated successfully!")
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast('error', "Passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      showToast('error', "Password must be at least 6 characters long.")
      return
    }
    try {
      const res = await authFetch("/api/driver/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      })
      if (!res.ok) throw new Error("Failed to change password")
      showToast('success', "Password changed successfully!")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      showToast('error', "Failed to change password. Please check your current password.")
    }
  }

  const handleDeleteAccount = async () => {
    showToast.loading("Deleting your account...")
    try {
      const res = await authFetch("/api/user/delete-account", {
        method: "DELETE",
      })

      if (res.ok) {
        showToast.success("Your account has been deleted successfully.")
        logout()
        router.push("/")
      } else {
        const data = await res.json()
        showToast.error(data.error || "Failed to delete account.")
      }
    } catch (error) {
      showToast.error("An unexpected error occurred.")
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6" />
          <div className="space-y-6">
            <div className="h-48 bg-gray-300 rounded-lg" />
            <div className="h-48 bg-gray-300 rounded-lg" />
            <div className="h-48 bg-gray-300 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Driver Settings</h1>
        <Button onClick={handleSaveChanges} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" /> Personal Information
            </CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" value={profile.first_name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" value={profile.last_name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={profile.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_details">Vehicle Details</Label>
              <Input id="vehicle_details" name="vehicle_details" value={profile.vehicle_details} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2" /> Change Password
            </CardTitle>
            <CardDescription>Update your password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="old_password">Current Password</Label>
                <Input id="old_password" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input id="confirm_password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Change Password</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                    <Trash2 className="mr-2"/> Danger Zone
                </CardTitle>
                <CardDescription>This action is permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete My Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}