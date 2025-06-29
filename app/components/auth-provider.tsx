import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, login, logout, switchRole, isLoading } = useAuth();

  const fetchVendorProfile = useCallback(async (): Promise<VendorProfile | null> => {
    if (!user || user.role !== 'vendor') return null;
    const token = localStorage.getItem('token');
    const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
    const res = await fetch(`${baseApiUrl}/vendor/profile`, {
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
} 