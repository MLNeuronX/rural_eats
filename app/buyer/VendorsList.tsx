'use client';
import { Vendor } from "@/lib/data";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Truck, Clock } from "lucide-react";

function VendorCard({ vendor, index }: { vendor: Vendor; index: number }) {
  return (
    <div>
      <Link href={`/buyer/vendor/${vendor.id}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="aspect-[4/1] relative bg-gradient-to-r from-amber-100 to-orange-100">
            <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="object-cover w-full h-full" />
            {!vendor.isOpen && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <p className="text-white font-medium">Currently Closed</p>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-current" />
              <span className="text-sm font-medium text-gray-800">{vendor.rating}</span>
            </div>
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
                <span>${(vendor.deliveryFee || 0).toFixed(2)} delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>25-35 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default function VendorsList({ vendors }: { vendors: Vendor[] }) {
  return (
    <div className="grid gap-4">
      {vendors.map((vendor, index) => (
        <VendorCard key={vendor.id} vendor={vendor} index={index} />
      ))}
    </div>
  );
} 