export interface KitchenPrintData {
  orderId: string
  items: Array<{
    name: string
    quantity: number
    price: number
    specialInstructions?: string
  }>
  customerInfo: {
    name: string
    phone?: string
    specialInstructions?: string
  }
  orderInfo: {
    orderNumber: string
    timestamp: string
    total: number
    deliveryAddress?: string
  }
  vendorInfo: {
    name: string
    address: string
  }
}

export interface PrinterInfo {
  name: string;
  ipAddress: string;
  port: string;
  isConnected: boolean;
}

export class KitchenPrinterService {
  private isConnected = false
  private printerIP = process.env.NEXT_PUBLIC_KITCHEN_PRINTER_IP || '192.168.1.100'
  private printerPort = process.env.NEXT_PUBLIC_KITCHEN_PRINTER_PORT || '9100'
  private printerName = ''
  private availablePrinters: PrinterInfo[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []

  constructor() {
    this.loadSavedPrinterSettings()
    this.initializePrinter()
  }

  private loadSavedPrinterSettings() {
    try {
      const savedSettings = localStorage.getItem('kitchenPrinterSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        this.printerIP = settings.ipAddress || this.printerIP
        this.printerPort = settings.port || this.printerPort
        this.printerName = settings.name || ''
      }
    } catch (error) {
      console.error('Failed to load saved printer settings:', error)
    }
  }

  private savePrinterSettings() {
    try {
      const settings = {
        ipAddress: this.printerIP,
        port: this.printerPort,
        name: this.printerName,
      }
      localStorage.setItem('kitchenPrinterSettings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save printer settings:', error)
    }
  }

  private async initializePrinter() {
    try {
      // Try to connect to the saved printer
      console.log(`Connecting to kitchen printer at ${this.printerIP}:${this.printerPort}`)
      
      // In a real implementation, we would use WebSocket or similar to connect to the printer
      // For now, we'll simulate the connection with a network check
      const isReachable = await this.checkPrinterConnection(this.printerIP, this.printerPort)
      
      this.isConnected = isReachable
      this.notifyConnectionListeners()
      
      if (isReachable) {
        console.log('Kitchen printer connected successfully')
      } else {
        console.warn('Kitchen printer not reachable, please check connection')
      }
    } catch (error) {
      console.error('Failed to connect to kitchen printer:', error)
      this.isConnected = false
      this.notifyConnectionListeners()
    }
  }
  
  private async checkPrinterConnection(ip: string, port: string): Promise<boolean> {
    try {
      // In a real implementation, we would use fetch with a timeout to check if the printer is reachable
      // For demonstration purposes, we'll simulate a network check
      const response = await fetch(`http://${ip}:${port}/status`, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      })
      return true
    } catch (error) {
      // For demo purposes, we'll return true 70% of the time to simulate a successful connection
      return Math.random() > 0.3
    }
  }

  // Add connection listener
  public addConnectionListener(listener: (connected: boolean) => void) {
    this.connectionListeners.push(listener)
    // Immediately notify with current status
    listener(this.isConnected)
  }

  // Remove connection listener
  public removeConnectionListener(listener: (connected: boolean) => void) {
    this.connectionListeners = this.connectionListeners.filter(l => l !== listener)
  }

  // Notify all connection listeners
  private notifyConnectionListeners() {
    this.connectionListeners.forEach(listener => listener(this.isConnected))
  }

  // Get connection status
  public getConnectionStatus(): boolean {
    return this.isConnected
  }

  // Get printer info
  public getPrinterInfo(): PrinterInfo {
    return {
      name: this.printerName,
      ipAddress: this.printerIP,
      port: this.printerPort,
      isConnected: this.isConnected
    }
  }

  // Set printer info and connect
  public async setPrinterInfo(info: Partial<PrinterInfo>): Promise<boolean> {
    if (info.ipAddress) this.printerIP = info.ipAddress
    if (info.port) this.printerPort = info.port
    if (info.name) this.printerName = info.name
    
    this.savePrinterSettings()
    return this.initializePrinter()
  }

  // Scan for network printers
  public async scanForPrinters(): Promise<PrinterInfo[]> {
    // In a real implementation, this would scan the network for printers
    // For now, we'll return some mock printers
    this.availablePrinters = [
      { name: 'Kitchen Printer', ipAddress: '192.168.1.100', port: '9100', isConnected: false },
      { name: 'Office Printer', ipAddress: '192.168.1.101', port: '9100', isConnected: false },
      { name: 'Receipt Printer', ipAddress: '192.168.1.102', port: '9100', isConnected: false },
    ]
    
    // Check connection for each printer
    for (const printer of this.availablePrinters) {
      printer.isConnected = await this.checkPrinterConnection(printer.ipAddress, printer.port)
    }
    
    return this.availablePrinters
  }

  public async printOrder(printData: KitchenPrintData): Promise<boolean> {
    try {
      if (!this.isConnected) {
        console.warn('Kitchen printer not connected, attempting to reconnect...')
        await this.initializePrinter()
        
        if (!this.isConnected) {
          throw new Error('Printer not connected')
        }
      }

      // Generate print content
      const printContent = this.generatePrintContent(printData)
      
      // In a real implementation, this would send to the actual printer
      // For now, we'll simulate the print command using the Web Print API if available
      console.log('=== KITCHEN PRINTER OUTPUT ===')
      console.log(printContent)
      console.log('=== END KITCHEN PRINTER OUTPUT ===')
      
      // Try to use the browser's print API if available
      try {
        const printWindow = window.open('', 'Print Window', 'height=600,width=800')
        if (printWindow) {
          printWindow.document.write('<html><head><title>Kitchen Order</title>')
          printWindow.document.write('<style>body { font-family: monospace; white-space: pre; }</style>')
          printWindow.document.write('</head><body>')
          printWindow.document.write(`<pre>${printContent}</pre>`)
          printWindow.document.write('</body></html>')
          printWindow.document.close()
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        }
      } catch (e) {
        console.warn('Browser print API failed, falling back to simulation', e)
        // Simulate print delay
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      return true
    } catch (error) {
      console.error('Failed to print order:', error)
      return false
    }
  }

  private generatePrintContent(data: KitchenPrintData): string {
    const { orderId, items, customerInfo, orderInfo, vendorInfo } = data
    
    let content = ''
    
    // Header
    content += '='.repeat(32) + '\n'
    content += `    ${vendorInfo.name.toUpperCase()}\n`
    content += `    KITCHEN ORDER\n`
    content += '='.repeat(32) + '\n\n'
    
    // Order Info
    content += `Order #: ${orderInfo.orderNumber}\n`
    content += `Time: ${new Date(orderInfo.timestamp).toLocaleString()}\n`
    content += `Total: $${orderInfo.total.toFixed(2)}\n\n`
    
    // Customer Info
    content += `Customer: ${customerInfo.name}\n`
    if (customerInfo.phone) {
      content += `Phone: ${customerInfo.phone}\n`
    }
    if (orderInfo.deliveryAddress) {
      content += `Delivery: ${orderInfo.deliveryAddress}\n`
    }
    content += '\n'
    
    // Items
    content += 'ITEMS:\n'
    content += '-'.repeat(32) + '\n'
    
    items.forEach(item => {
      content += `${item.quantity}x ${item.name}\n`
      content += `   $${(item.price * item.quantity).toFixed(2)}\n`
      if (item.specialInstructions) {
        content += `   Note: ${item.specialInstructions}\n`
      }
      content += '\n'
    })
    
    // Special Instructions
    if (customerInfo.specialInstructions) {
      content += 'SPECIAL INSTRUCTIONS:\n'
      content += '-'.repeat(32) + '\n'
      content += `${customerInfo.specialInstructions}\n\n`
    }
    
    // Footer
    content += '='.repeat(32) + '\n'
    content += `Order ID: ${orderId}\n`
    content += `Printed: ${new Date().toLocaleString()}\n`
    content += '='.repeat(32) + '\n'
    
    return content
  }

  public async testConnection(): Promise<boolean> {
    try {
      await this.initializePrinter()
      return this.isConnected
    } catch (error) {
      console.error('Kitchen printer test failed:', error)
      return false
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false
    console.log('Kitchen printer disconnected')
  }
}

// Create singleton instance
export const kitchenPrinter = new KitchenPrinterService()

// Helper function to print order
export const printKitchenOrder = async (orderData: any): Promise<boolean> => {
  try {
    const printData: KitchenPrintData = {
      orderId: orderData.id,
      items: orderData.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions
      })),
      customerInfo: {
        name: orderData.customerName || 'Customer',
        phone: orderData.customerPhone,
        specialInstructions: orderData.specialInstructions
      },
      orderInfo: {
        orderNumber: orderData.id.slice(0, 8),
        timestamp: orderData.createdAt,
        total: orderData.total,
        deliveryAddress: orderData.deliveryAddress
      },
      vendorInfo: {
        name: orderData.vendorName || 'Restaurant',
        address: orderData.vendorAddress || 'Vendor Location'
      }
    }

    return await kitchenPrinter.printOrder(printData)
  } catch (error) {
    console.error('Failed to print kitchen order:', error)
    return false
  }
}