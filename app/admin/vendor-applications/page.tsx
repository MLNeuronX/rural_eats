"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { authFetch } from "@/lib/utils"

interface VendorApplication {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  business_name: string
  business_address: string
  business_type: string
  status: string
  created_at: string
  estimated_review_date: string
  notes?: string
  reviewed_at?: string
  reviewed_by?: string
}

export default function VendorApplicationsPage() {
  const [applications, setApplications] = useState<VendorApplication[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await authFetch("/api/admin/vendor-applications", {
        credentials: "include"
      })
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      // toast({ title: "Error", description: "Failed to load applications", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (id: string, action: "approve" | "reject", notes?: string) => {
    try {
      const res = await authFetch(`/api/admin/vendor-applications/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes })
      })
      const data = await res.json()
      if (res.ok) {
        // toast({ title: `Application ${action}d`, description: data.message })
        fetchApplications()
      } else {
        // toast({ title: "Error", description: data.error || "Action failed", variant: "destructive" })
      }
    } catch (error) {
      // toast({ title: "Error", description: "Action failed", variant: "destructive" })
    }
  }

  const filtered = applications.filter(app =>
    app.first_name.toLowerCase().includes(search.toLowerCase()) ||
    app.last_name.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase()) ||
    app.business_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Vendor Applications</h1>
      <Input
        placeholder="Search by name, email, or business..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-md mb-6"
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div>No applications found.</div>
      ) : (
        <div className="grid gap-6">
          {filtered.map(app => (
            <Card key={app.id}>
              <CardContent className="p-6 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">{app.business_name}</div>
                    <div className="text-muted-foreground text-sm">{app.first_name} {app.last_name} ({app.email})</div>
                  </div>
                  <Badge variant={app.status === "pending" ? "secondary" : app.status === "approved" ? "secondary" : "destructive"}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm">Type: {app.business_type} | Phone: {app.phone}</div>
                <div className="text-sm">Address: {app.business_address}</div>
                <div className="text-sm">Applied: {new Date(app.created_at).toLocaleString()}</div>
                <div className="text-sm">Est. Review: {new Date(app.estimated_review_date).toLocaleDateString()}</div>
                {app.notes && <div className="text-sm text-muted-foreground">Notes: {app.notes}</div>}
                <div className="flex gap-2 mt-2">
                  {app.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleAction(app.id, "approve")}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(app.id, "reject", prompt("Enter rejection notes:") || "")}>Reject</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 