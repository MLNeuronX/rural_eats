"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VendorOnboardingPage() {
  const [printerConnected, setPrinterConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const handleConnectPrinter = async () => {
    setConnecting(true)
    // TODO: Replace with real printer connection logic
    setTimeout(() => {
      setPrinterConnected(true)
      setConnecting(false)
    }, 1500)
  }

  return (
    <div className="container max-w-xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Onboarding: Connect Your Kitchen Printer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">To enable automatic kitchen printouts, please connect your kitchen printer below.</p>
          <Button onClick={handleConnectPrinter} disabled={printerConnected || connecting} className="mb-4">
            {connecting ? "Connecting..." : printerConnected ? "Printer Connected" : "Connect Printer"}
          </Button>
          {printerConnected && <div className="text-green-600 font-semibold">Printer successfully connected!</div>}
          {!printerConnected && !connecting && <div className="text-gray-500 text-sm">No printer connected yet.</div>}
        </CardContent>
      </Card>
    </div>
  )
} 