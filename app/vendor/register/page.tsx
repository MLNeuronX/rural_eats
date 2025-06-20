import { RegisterForm } from "@/components/auth/register-form"

export default function VendorRegisterPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <RegisterForm role="vendor" title="Apply as Restaurant Partner" />
    </div>
  )
}
