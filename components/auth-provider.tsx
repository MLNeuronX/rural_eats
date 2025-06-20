"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

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

// Define mock users outside component to prevent recreation
const mockUsers: Record<string, User> = {
  buyer: { id: "b1", name: "John Buyer", email: "buyer@example.com", role: "buyer" },
  vendor: { id: "v1", name: "Mary's Restaurant", email: "vendor@example.com", role: "vendor" },
  driver: { id: "d1", name: "Dave Driver", email: "driver@example.com", role: "driver" },
  admin: { id: "a1", name: "Admin User", email: "admin@example.com", role: "admin" },
}

const defaultAdminUser: User = {
  id: "preview-admin",
  name: "Preview Admin",
  email: "admin@preview.com",
  role: "admin",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultAdminUser)
  const [role, setRole] = useState<Role>("admin")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize only once
  useEffect(() => {
    if (!isInitialized) {
      setUser(defaultAdminUser)
      setRole("admin")
      setIsInitialized(true)
    }
  }, [isInitialized])

  const login = useCallback(async (email: string, password: string, role: Role): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (role && mockUsers[role]) {
        const loggedInUser = mockUsers[role]
        setUser(loggedInUser)
        setRole(role)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(defaultAdminUser)
    setRole("admin")
  }, [])

  const switchRole = useCallback((newRole: Role) => {
    if (newRole && mockUsers[newRole]) {
      setUser(mockUsers[newRole])
      setRole(newRole)
    }
  }, [])

  const contextValue = {
    user,
    role,
    login,
    logout,
    switchRole,
    isLoading,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
