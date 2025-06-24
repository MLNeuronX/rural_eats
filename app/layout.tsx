import React, { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster, toast } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rural Drop - Local Food Delivery",
  description: "Food delivery for small towns and rural communities",
    generator: 'v0.dev'
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
    toast("An error occurred: " + (error.message || "Unknown error"));
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light">
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
        <Toaster />
      </body>
    </html>
  )
}
