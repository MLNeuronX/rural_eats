"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Role = "buyer" | "vendor" | "driver" | "admin" | null

interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthContextType {
  user: User | null
  role: Role
  login: (email: string, password: string, role: Role) => Promise<boolean>
  logout: () => void
  switchRole: (role: Role) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function PreviewAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>("admin") // Default to admin for preview
  const [isLoading, setIsLoading] = useState(false) // Set to false for immediate access

  // Initialize with admin user for preview mode
  useEffect(() => {
    const adminUser = {
      id: "preview-admin",
      name: "Preview Admin",
      email: "admin@preview.com",
      role: "admin" as Role,
    }
    setUser(adminUser)
    setRole("admin")
  }, [])

  const login = async (email: string, password: string, role: Role): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockUsers: Record<string, User> = {
        buyer: { id: "b1", name: "John Buyer", email: "buyer@example.com", role: "buyer" },
        vendor: { id: "v1", name: "Mary's Restaurant", email: "vendor@example.com", role: "vendor" },
        driver: { id: "d1", name: "Dave Driver", email: "driver@example.com", role: "driver" },
        admin: { id: "a1", name: "Admin User", email: "admin@example.com", role: "admin" },
      }

      const loggedInUser = mockUsers[role]
      setUser(loggedInUser)
      setRole(role)

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // In preview mode, just switch back to admin
    const adminUser = {
      id: "preview-admin",
      name: "Preview Admin",
      email: "admin@preview.com",
      role: "admin" as Role,
    }
    setUser(adminUser)
    setRole("admin")
  }

  const switchRole = (newRole: Role) => {
    const mockUsers: Record<string, User> = {
      buyer: { id: "b1", name: "John Buyer", email: "buyer@example.com", role: "buyer" },
      vendor: { id: "v1", name: "Mary's Restaurant", email: "vendor@example.com", role: "vendor" },
      driver: { id: "d1", name: "Dave Driver", email: "driver@example.com", role: "driver" },
      admin: { id: "a1", name: "Admin User", email: "admin@example.com", role: "admin" },
    }

    if (newRole && mockUsers[newRole]) {
      setUser(mockUsers[newRole])
      setRole(newRole)
    }
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
