"use client"

import * as React from "react"
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
  // Remove all preview/demo/mock logic
  return <>{children}</>;
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
