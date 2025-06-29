'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Printer, RefreshCw, Save, CheckCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { KitchenPrinterService, PrinterInfo } from '@/lib/kitchen-printer'

interface PrinterSettingsProps {
  onSave?: () => void
  saveSuccess?: boolean
  isLoading?: boolean
}

export default function PrinterSettings({ onSave, saveSuccess, isLoading }: PrinterSettingsProps) {
  const [printerService] = useState(() => new KitchenPrinterService())
  const [printerInfo, setPrinterInfo] = useState<PrinterInfo>({
    name: '',
    ipAddress: '',
    port: '',
    isConnected: false
  })
  const [availablePrinters, setAvailablePrinters] = useState<PrinterInfo[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [testPrintStatus, setTestPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle')

  // Load printer settings on component mount
  useEffect(() => {
    const loadPrinterInfo = async () => {
      try {
        const info = await printerService.getPrinterInfo()
        setPrinterInfo(info)

        // Add connection listener
        const listener = (connected: boolean) => {
          setPrinterInfo(prev => ({ ...prev, isConnected: connected }))
        }
        printerService.addConnectionListener(listener)

        return () => {
          printerService.removeConnectionListener(listener)
        }
      } catch (error) {
        console.error('Failed to load printer info:', error)
      }
    }

    loadPrinterInfo()
  }, [])

  const handlePrinterInfoChange = (field: keyof PrinterInfo, value: string) => {
    setPrinterInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsConnecting(true)
    try {
      await printerService.setPrinterInfo(printerInfo)
      if (onSave) onSave()
    } catch (error) {
      console.error('Failed to save printer settings:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleScanForPrinters = async () => {
    setIsScanning(true)
    try {
      const printers = await printerService.scanForPrinters()
      setAvailablePrinters(printers)
    } catch (error) {
      console.error('Failed to scan for printers:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleSelectPrinter = (printer: PrinterInfo) => {
    setPrinterInfo(printer)
  }

  const handleTestPrint = async () => {
    setTestPrintStatus('printing')
    try {
      const success = await printerService.printOrder({
        orderId: 'TEST-ORDER',
        items: [
          { name: 'Test Item 1', quantity: 1, price: 10.00, specialInstructions: 'Test note' },
          { name: 'Test Item 2', quantity: 2, price: 15.00 }
        ],
        customerInfo: {
          name: 'Test Customer',
          phone: '555-1234',
          specialInstructions: 'Test order'
        },
        orderInfo: {
          orderNumber: 'TEST-123',
          timestamp: new Date().toISOString(),
          total: 40.00,
          deliveryAddress: '123 Test St'
        },
        vendorInfo: {
          name: 'Test Restaurant',
          address: '456 Restaurant Ave'
        }
      })
      
      setTestPrintStatus(success ? 'success' : 'error')
      setTimeout(() => setTestPrintStatus('idle'), 3000)
    } catch (error) {
      console.error('Test print failed:', error)
      setTestPrintStatus('error')
      setTimeout(() => setTestPrintStatus('idle'), 3000)
    }
  }

  return (
    <Card className="border-forest-green/20">
      <CardHeader className="bg-parchment/30">
        <CardTitle className="text-forest-green">Kitchen Printer Settings</CardTitle>
        <CardDescription>Configure your kitchen printer for order tickets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-forest-green" />
            <h3 className="text-lg font-medium">Printer Status</h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
              printerInfo.isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <motion.span
              className={`w-2 h-2 rounded-full ${printerInfo.isConnected ? "bg-green-500" : "bg-red-500"}`}
              animate={{ scale: printerInfo.isConnected ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: printerInfo.isConnected ? Number.POSITIVE_INFINITY : 0, repeatDelay: 1 }}
            ></motion.span>
            {printerInfo.isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="printerName">Printer Name</Label>
            <Input
              id="printerName"
              value={printerInfo.name}
              onChange={(e) => handlePrinterInfoChange("name", e.target.value)}
              className="border-forest-green/20 focus-visible:ring-forest-green/30"
              placeholder="Kitchen Printer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="printerIP">IP Address</Label>
              <Input
                id="printerIP"
                value={printerInfo.ipAddress}
                onChange={(e) => handlePrinterInfoChange("ipAddress", e.target.value)}
                className="border-forest-green/20 focus-visible:ring-forest-green/30"
                placeholder="192.168.1.100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="printerPort">Port</Label>
              <Input
                id="printerPort"
                value={printerInfo.port}
                onChange={(e) => handlePrinterInfoChange("port", e.target.value)}
                className="border-forest-green/20 focus-visible:ring-forest-green/30"
                placeholder="9100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handleScanForPrinters}
              disabled={isScanning}
              className="border-forest-green/20 text-forest-green hover:bg-forest-green/10"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan for Printers
                </>
              )}
            </Button>

            {availablePrinters.length > 0 && (
              <div className="space-y-2">
                <Label>Available Printers</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md border-forest-green/20">
                  {availablePrinters.map((printer, index) => (
                    <motion.div
                      key={index}
                      className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                        printer.ipAddress === printerInfo.ipAddress ? 'bg-forest-green/10' : 'hover:bg-forest-green/5'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSelectPrinter(printer)}
                    >
                      <div>
                        <p className="font-medium">{printer.name}</p>
                        <p className="text-sm text-muted-foreground">{printer.ipAddress}:{printer.port}</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          printer.isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {printer.isConnected ? "Available" : "Unavailable"}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleTestPrint}
              disabled={testPrintStatus === 'printing' || !printerInfo.isConnected}
              className="border-forest-green/20 text-forest-green hover:bg-forest-green/10"
            >
              {testPrintStatus === 'printing' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Printing...
                </>
              ) : testPrintStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Print Successful
                </>
              ) : testPrintStatus === 'error' ? (
                <>Print Failed</>
              ) : (
                <>Test Print</>
              )}
            </Button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading || isConnecting}
                className="bg-forest-green hover:bg-forest-green/90 text-white"
              >
                {saveSuccess ? (
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
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save & Connect"}
                      </>
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}