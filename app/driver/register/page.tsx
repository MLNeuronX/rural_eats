import { RegisterForm } from "@/components/auth/register-form"

export default function DriverRegisterPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <RegisterForm role="driver" title="Become a Delivery Driver" />
    </div>
  )
}
