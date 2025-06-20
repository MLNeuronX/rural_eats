import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, MapPin } from "lucide-react"
import { getVendorById, getMenuItems } from "@/lib/data"
import { AddToCartButton } from "./add-to-cart-button"

async function VendorDetails({ id }: { id: string }) {
  const vendor = await getVendorById(id)

  if (!vendor) {
    notFound()
  }

  return (
    <div>
      <div className="relative h-40 bg-muted">
        <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="w-full h-full object-cover" />
        {!vendor.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-white font-medium text-lg">Currently Closed</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <p className="text-muted-foreground">{vendor.description}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">{vendor.rating}★</div>
        </div>

        <div className="flex flex-col gap-2 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{vendor.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {vendor.isOpen ? "Open" : "Closed"} • {vendor.openingTime} - {vendor.closingTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

async function MenuItems({ vendorId }: { vendorId: string }) {
  const menuItems = await getMenuItems(vendorId)

  // Group menu items by category
  const categories = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof menuItems>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-lg font-semibold mb-3">{category}</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="ml-4">
                    <AddToCartButton menuItem={item} disabled={!item.available} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MenuItemsSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3)
        .fill(0)
        .map((_, categoryIndex) => (
          <div key={categoryIndex}>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, itemIndex) => (
                  <Card key={itemIndex}>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}

export default function VendorPage({ params }: { params: { id: string } }) {
  return (
    <div className="pb-6">
      <div className="sticky top-0 z-10 bg-background p-2 border-b">
        <Link href="/buyer">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <VendorDetails id={params.id} />
      </Suspense>

      <div className="px-4 mt-4">
        <Tabs defaultValue="menu">
          <TabsList className="w-full">
            <TabsTrigger value="menu" className="flex-1">
              Menu
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1">
              Info
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="menu" className="mt-4">
            <Suspense fallback={<MenuItemsSkeleton />}>
              <MenuItems vendorId={params.id} />
            </Suspense>
          </TabsContent>
          <TabsContent value="info">
            <div className="p-4 text-sm space-y-4">
              <p>
                <strong>Address:</strong> 123 Main St, Rural Town
              </p>
              <p>
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                Monday - Friday: 10:00 AM - 9:00 PM
                <br />
                Saturday - Sunday: 11:00 AM - 10:00 PM
              </p>
              <p>
                <strong>Delivery Fee:</strong> $3.99
              </p>
              <p>
                <strong>Minimum Order:</strong> $10.00
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="p-4 text-center text-muted-foreground">Reviews coming soon</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
