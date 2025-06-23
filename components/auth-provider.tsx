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

interface LoginResult {
  success: boolean;
  login_status?: 'application_pending';
  application?: any; // Consider creating a specific type for this
  error?: string;
}

interface AuthContextType {
  user: User | null
  role: Role
  login: (email: string, password: string, role: Role) => Promise<LoginResult>
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
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // On initial load, try to get user data if a token exists
  useEffect(() => {
    const initializeAuth = async () => {
      // In a real app, you would verify a token from localStorage here
      // For now, we start with no user logged in.
      setUser(null);
      setRole(null);
      setIsLoading(false);
      setIsInitialized(true);
    };
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized]);

  const login = useCallback(async (email: string, password: string, role: Role): Promise<LoginResult> => {
    setIsLoading(true);

    // All roles (including vendor) should use the user login endpoint
    const endpoint = 'https://rural-eats-backend.onrender.com/api/user/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }), // 'role' is needed for the general user login
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        const loggedInUser: User = {
          id: data.user?.id || data.vendor?.id,
          name: data.user?.email || data.vendor?.business_name,
          email: data.user?.email || data.vendor?.email,
          role: role,
        };
        setUser(loggedInUser);
        setRole(role);
        // In a real app, save data.access_token to localStorage
        return { success: true };

      } else if (response.status === 202 && data.login_status === 'application_pending') {
        // Application is pending
        return { success: false, login_status: 'application_pending', application: data.application };
      } else {
        // Other login failures
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error("Login API error:", error);
      return { success: false, error: "An network error occurred. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null)
    setRole(null)
    // In a real app, remove token from localStorage
  }, []);

  const switchRole = useCallback((newRole: Role) => {
    // This function is now less relevant with a real backend,
    // as roles are tied to user accounts.
    // It could be repurposed for admins to impersonate other roles.
    console.log(`Switching role view to ${newRole} (for development)`);
    setRole(newRole);
  }, []);

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
