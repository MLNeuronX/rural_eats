"use client"

import { Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Star, Clock, Truck } from "lucide-react"
import { getVendors, type Vendor } from "@/lib/data"

function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/buyer/vendor/${vendor.id}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="aspect-[4/1] relative bg-gradient-to-r from-amber-100 to-orange-100">
            <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="object-cover w-full h-full" />
            {!vendor.isOpen && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <p className="text-white font-medium">Currently Closed</p>
              </div>
            )}
            <motion.div
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-3 w-3 text-amber-500 fill-current" />
              <span className="text-sm font-medium text-gray-800">{vendor.rating}</span>
            </motion.div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{vendor.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {vendor.cuisineType} •{" "}
                  {vendor.priceRange === "low" ? "$" : vendor.priceRange === "medium" ? "$$" : "$$$"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                <span>${vendor.deliveryFee.toFixed(2)} delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>25-35 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function VendorSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <Skeleton className="h-24 w-full" />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

async function VendorsList() {
  const vendors = await getVendors()

  return (
    <div className="grid gap-4">
      {vendors.map((vendor, index) => (
        <VendorCard key={vendor.id} vendor={vendor} index={index} />
      ))}
    </div>
  )
}

export default function BuyerHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-300/30 rounded-full"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container max-w-md mx-auto px-4 py-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">What are you craving?</h1>
        </motion.div>

        <motion.div
          className="flex gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search restaurants..."
              className="pl-10 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:bg-amber-100"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        <Suspense
          fallback={
            <div className="grid gap-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <VendorSkeleton key={i} />
                ))}
            </div>
          }
        >
          <VendorsList />
        </Suspense>
      </div>
    </div>
  )
}
