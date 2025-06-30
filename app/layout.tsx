import * as React from "react"
import { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/buyer/cart-provider"
import { ToastProvider } from "@/components/ui/toast-provider"
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary"
import PerformanceMonitor from "@/components/PerformanceMonitor"
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration"
import { PageTracker } from "@/components/page-tracker"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  title: "Rural Eats",
  description: "Food delivery for rural communities",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export const themeColor = "#ffffff"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <GlobalErrorBoundary>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <PageTracker>
                  {children}
                </PageTracker>
                <PerformanceMonitor />
                <ServiceWorkerRegistration />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  )
}
