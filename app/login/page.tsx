import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCog, Store, Truck, ShoppingBag } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-8">Choose Your Portal</h1>
      <div className="space-y-4">
        <Link href="/admin/login">
          <Button className="w-full flex items-center justify-center gap-2" variant="outline">
            <UserCog className="h-5 w-5" /> Admin Login
          </Button>
        </Link>
        <Link href="/vendor/login">
          <Button className="w-full flex items-center justify-center gap-2" variant="outline">
            <Store className="h-5 w-5" /> Vendor Login
          </Button>
        </Link>
        <Link href="/vendor/register">
          <Button className="w-full flex items-center justify-center gap-2" variant="ghost">
            <Store className="h-5 w-5" /> Vendor Sign Up
          </Button>
        </Link>
        <Link href="/driver/login">
          <Button className="w-full flex items-center justify-center gap-2" variant="outline">
            <Truck className="h-5 w-5" /> Driver Login
          </Button>
        </Link>
        <Link href="/driver/register">
          <Button className="w-full flex items-center justify-center gap-2" variant="ghost">
            <Truck className="h-5 w-5" /> Driver Sign Up
          </Button>
        </Link>
        <Link href="/buyer/register">
          <Button className="w-full flex items-center justify-center gap-2" variant="outline">
            <ShoppingBag className="h-5 w-5" /> Buyer Sign Up
          </Button>
        </Link>
      </div>
    </div>
  )
} 