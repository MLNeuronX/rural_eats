"use client"
import { useAuth } from "@/components/auth-provider"

const VendorHeader = () => {
  const { user } = useAuth()

  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
      {user ? (
        <p>
          Welcome, {user.firstName} {user.lastName}!
        </p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  )
}

export default VendorHeader
