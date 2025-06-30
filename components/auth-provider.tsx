"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import * as Sentry from '@sentry/nextjs'

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

interface VendorProfile {
  business_name?: string;
  address?: string;
  phone?: string;
  cuisine_type?: string;
  price_range?: string;
  opening_time?: string;
  closing_time?: string;
  delivery_fee?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null
  role: Role
  login: (email: string, password: string, role: Role) => Promise<LoginResult>
  logout: () => void
  switchRole: (role: Role) => void
  isLoading: boolean
  fetchVendorProfile?: () => Promise<VendorProfile | null>
  isVendorProfileComplete?: (profile: VendorProfile) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // On initial load, try to get user data if a token exists
  useEffect(() => {
    const initializeAuth = async () => {
      // Check localStorage for saved user and token
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('role');
      if (savedUser && savedRole) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(savedRole as Role);
        
        // Set Sentry user context
        Sentry.setUser({
          id: parsedUser.id,
          email: parsedUser.email,
          role: savedRole,
        });
      }
      setIsLoading(false);
      setIsInitialized(true);
    };
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized]);

  const login = useCallback(async (email: string, password: string, role: Role): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
      // Ensure baseApiUrl doesn't end with /api to prevent double /api/ issue
      const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;
      const endpoint = `${cleanBaseUrl}/api/user/login`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      
      if (response.ok) {
        const loggedInUser: User = {
          id: data.user?.id || data.vendor?.id,
          name: data.user?.email || data.vendor?.business_name,
          email: data.user?.email || data.vendor?.email,
          role: role,
        };
        setUser(loggedInUser);
        setRole(role);
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('role', role || '');
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
        }

        // Set Sentry user context
        Sentry.setUser({
          id: loggedInUser.id,
          email: loggedInUser.email,
          role: role,
        });

        // Add breadcrumb for successful login
        Sentry.addBreadcrumb({
          category: 'auth',
          message: 'User logged in successfully',
          level: 'info',
          data: { role, email },
        });

        return { success: true };
      } else if (response.status === 202 && data.login_status === 'application_pending') {
        return { success: false, login_status: 'application_pending', application: data.application };
      } else {
        // Capture login failure
        Sentry.captureMessage('Login failed', {
          level: 'warning',
          tags: { role, email },
          contexts: {
            response: { status: response.status, data },
          },
        });
        
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      // Capture login error
      Sentry.captureException(error, {
        tags: { role, email },
        contexts: {
          operation: { name: 'user.login' },
        },
      });
      
      console.error("Login API error:", error);
      return { success: false, error: "An network error occurred. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Add breadcrumb for logout
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'User logged out',
      level: 'info',
      data: { role: user?.role, email: user?.email },
    });

    // Clear Sentry user context
    Sentry.setUser(null);
    
    setUser(null)
    setRole(null)
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  }, [user]);

  const switchRole = useCallback((newRole: Role) => {
    // This function is now less relevant with a real backend,
    // as roles are tied to user accounts.
    // It could be repurposed for admins to impersonate other roles.
    console.log(`Switching role view to ${newRole} (for development)`);
    setRole(newRole);
  }, []);

  const fetchVendorProfile = useCallback(async (): Promise<VendorProfile | null> => {
    if (!user || user.role !== 'vendor') return null;
    const token = localStorage.getItem('token');
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
    // Ensure baseApiUrl doesn't end with /api to prevent double /api/api/ issue
    const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;
    const res = await fetch(`${cleanBaseUrl}/api/vendor/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.vendor || data;
  }, [user]);

  const isVendorProfileComplete = (profile: VendorProfile) => {
    const required = [
      'business_name', 'address', 'phone',
      'cuisine_type', 'price_range', 'opening_time', 'closing_time', 'delivery_fee'
    ];
    return required.every(field => profile[field]);
  };

  const contextValue = {
    user,
    role,
    login,
    logout,
    switchRole,
    isLoading,
    fetchVendorProfile,
    isVendorProfileComplete,
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
