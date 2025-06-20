import { RegisterForm } from "@/components/auth/register-form"

export default function BuyerRegisterPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <RegisterForm role="buyer" title="Create Buyer Account" />
    </div>
  )
}
