import React, { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/buyer/cart-provider"
import { ToastProvider } from "@/components/ui/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rural Eats",
  description: "Food delivery for rural communities",
}

class GlobalErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // No toast usage
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="w-full bg-yellow-200 text-yellow-900 text-center py-2 text-sm font-semibold">
          DEMO MODE: This is a test environment. Printer and notifications are simulated.
        </div>
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
                {children}
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  )
}
