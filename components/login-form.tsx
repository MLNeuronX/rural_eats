"use client"

import * as React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { showToast } from "@/components/ui/toast-provider"

interface LoginFormProps {
  role: "buyer" | "vendor" | "driver" | "admin"
  title: string
}

interface ApplicationStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  estimatedReviewDate: string;
  notes: string;
}

export function LoginForm({ role, title }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setApplicationStatus(null);

    try {
      const result = await login(email, password, role)

      if (result.success) {
        if (role === "admin") {
          showToast('success', "Login successful! Welcome, Admin.")
        }
        if (role === "driver") {
          showToast('success', "Login successful! Welcome, Driver.")
        }
        if (role === "buyer") {
          showToast('success', "Login successful! Welcome, Buyer.")
        }
        if (role === "vendor") {
          showToast('success', "Login successful! Welcome, Vendor.")
        }
        const redirectUrl = {
          admin: "/admin",
          vendor: "/vendor",
          driver: "/driver",
          buyer: "/buyer",
        }[role]
        router.push(redirectUrl)
      } else if (result.login_status === 'application_pending') {
        setApplicationStatus(result.application);
      } else {
        if (role === "admin") {
          showToast('error', result.error || "Invalid credentials. Please try again.")
        }
        if (role === "driver" || role === "buyer") {
          showToast('error', result.error || "Invalid credentials. Please try again.")
        }
        if (role === "vendor") {
          showToast('error', result.error || "Invalid credentials. Please try again.")
        }
      }
    } catch (error: any) {
      if (role === "admin") {
        showToast('error', "An error occurred. Please try again.")
      }
      if (role === "driver" || role === "buyer") {
        showToast('error', "An error occurred. Please try again.")
      }
      if (role === "vendor") {
        showToast('error', "An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (applicationStatus) {
    const statusInfo = {
      pending: { icon: Clock, color: "text-yellow-500", title: "Application Pending" },
      under_review: { icon: Clock, color: "text-blue-500", title: "Application Under Review" },
      approved: { icon: CheckCircle, color: "text-green-500", title: "Application Approved" },
      rejected: { icon: XCircle, color: "text-red-500", title: "Application Rejected" },
    };

    const currentStatusInfo = statusInfo[applicationStatus.status] || statusInfo.pending;
    const Icon = currentStatusInfo.icon;

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={() => setApplicationStatus(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Application Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
            <Icon className={`mx-auto h-16 w-16 mb-4 ${currentStatusInfo.color}`} />
            <h2 className={`text-2xl font-bold ${currentStatusInfo.color}`}>{currentStatusInfo.title}</h2>
            <p className="text-muted-foreground mt-2">Application ID: {applicationStatus.id}</p>
            <p className="mt-4">{applicationStatus.notes}</p>
            {applicationStatus.status === 'pending' && (
              <p className="text-sm text-muted-foreground mt-2">Estimated Review Date: {applicationStatus.estimatedReviewDate}</p>
            )}
            {applicationStatus.status === 'approved' && (
                <p className="mt-4">You can now log in to access your dashboard.</p>
            )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setApplicationStatus(null)}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Link href="/" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
