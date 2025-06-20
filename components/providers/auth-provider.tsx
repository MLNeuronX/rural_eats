"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Role = "buyer" | "vendor" | "driver" | "admin"

interface User {
  id: string
  name: string
  role: Role
}

interface AuthContextType {
  user: User
  setRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: Record<Role, User> = {
  buyer: { id: "buyer-1", name: "John Smith", role: "buyer" },
  vendor: { id: "vendor-1", name: "Maria's Kitchen", role: "vendor" },
  driver: { id: "driver-1", name: "Dave Wilson", role: "driver" },
  admin: { id: "admin-1", name: "Admin User", role: "admin" },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockUsers.buyer)

  // Load saved role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("rural-eats-role") as Role
    if (savedRole && mockUsers[savedRole]) {
      setUser(mockUsers[savedRole])
    }
  }, [])

  const setRole = (role: Role) => {
    setUser(mockUsers[role])
    localStorage.setItem("rural-eats-role", role)
  }

  return <AuthContext.Provider value={{ user, setRole }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
