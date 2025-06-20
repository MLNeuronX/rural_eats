"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"

const DriverHeader: React.FC = () => {
  const { user } = useAuth()

  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {user.firstName} {user.lastName}!
            </span>
            {/* Add any other user-related information or actions here */}
          </div>
        ) : (
          <span className="text-gray-700">Not logged in</span>
        )}
      </div>
    </header>
  )
}

export default DriverHeader
