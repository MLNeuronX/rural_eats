"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Mail, Phone, Copy } from "lucide-react"
import Link from "next/link"

export default function ApplicationSubmittedPage() {
  const [applicationId, setApplicationId] = useState<string | null>(null)

  useEffect(() => {
    // Get application ID from sessionStorage (set during registration)
    const storedId = sessionStorage.getItem('vendorApplicationId')
    if (storedId) {
      setApplicationId(storedId)
      // Clear it after displaying
      sessionStorage.removeItem('vendorApplicationId')
    }
  }, [])

  const copyApplicationId = () => {
    if (applicationId) {
      navigator.clipboard.writeText(applicationId)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>Application Submitted!</CardTitle>
          <CardDescription>Thank you for your interest in becoming a Rural Drop partner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {applicationId && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Your Application ID</h4>
              <div className="flex items-center justify-between">
                <code className="text-sm bg-background px-2 py-1 rounded">{applicationId}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyApplicationId}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save this ID to track your application status
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Review Process</h3>
                <p className="text-sm text-muted-foreground">
                  Our team will review your application within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Email Notification</h3>
                <p className="text-sm text-muted-foreground">You'll receive an email with next steps once approved</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Questions?</h3>
                <p className="text-sm text-muted-foreground">Contact us at (555) 123-4567 or support@ruraldrop.com</p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Application review (24-48 hours)</li>
              <li>2. Setup Stripe Connect for payments</li>
              <li>3. Menu and profile setup</li>
              <li>4. Go live and start receiving orders!</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link href="/vendor/track-application" className="flex-1">
              <Button className="w-full">Track Application</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
