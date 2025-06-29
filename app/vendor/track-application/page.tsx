"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authFetch } from "@/lib/utils"

type ApplicationStatus = "pending" | "approved" | "rejected" | "under_review"

interface ApplicationData {
  id: string
  businessName: string
  applicantName: string
  email: string
  phone: string
  status: ApplicationStatus
  submittedDate: string
  estimatedReviewDate: string
  notes?: string
}

export default function TrackApplicationPage() {
  const [email, setEmail] = useState("")
  const [applicationId, setApplicationId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [application, setApplication] = useState<ApplicationData | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email && !applicationId) {
      return
    }

    setIsSearching(true)

    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
      const response = await authFetch(`${baseApiUrl}/api/vendor/track-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, applicationId }),
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data)
      } else {
        // Handle error response
        let errorMessage = 'Failed to search application'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }
        console.error('Search failed:', errorMessage)
        setApplication(null)
      }
    } catch (error) {
      console.error('Search error:', error)
      setApplication(null)
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>
      case "under_review":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" />Under Review</Badge>
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusDescription = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "Your application has been received and is waiting to be reviewed by our team."
      case "under_review":
        return "Our team is currently reviewing your application and conducting necessary checks."
      case "approved":
        return "Congratulations! Your application has been approved. You'll receive setup instructions shortly."
      case "rejected":
        return "We're sorry, but your application was not approved at this time. Please contact us for more information."
      default:
        return "Status unknown. Please contact support."
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/vendor/application-submitted">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Track Application</h1>
      </div>

      {!application ? (
        <Card>
          <CardHeader>
            <CardTitle>Find Your Application</CardTitle>
            <CardDescription>
              Enter your email address or application ID to check your application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter the email used in your application"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationId">Application ID</Label>
                <Input
                  id="applicationId"
                  placeholder="Enter your application ID (e.g., APP-2024-001)"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Application
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">How to find your application</h4>
              <p className="text-sm text-muted-foreground mb-2">
                You can search using:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• The email address you used when applying</li>
                <li>• Your application ID (sent to your email after submission)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Application Status</CardTitle>
              {getStatusBadge(application.status)}
            </div>
            <CardDescription>
              {getStatusDescription(application.status)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Application Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application ID:</span>
                    <span className="font-medium">{application.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Name:</span>
                    <span className="font-medium">{application.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applicant:</span>
                    <span className="font-medium">{application.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{application.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{application.phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="font-medium">{application.submittedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Review:</span>
                    <span className="font-medium">{application.estimatedReviewDate}</span>
                  </div>
                </div>
              </div>

              {application.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{application.notes}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setApplication(null)}
              >
                Search Another
              </Button>
              <Link href="/" className="flex-1">
                <Button className="w-full">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}