"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordInner() {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
      const res = await fetch(`${baseApiUrl}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        // No toast notification needed as per the new code
      }
    } catch (error) {
      console.error("Error submitting reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {success ? (
        <p>Password reset! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>Reset Password</Button>
        </form>
      )}
    </div>
  );
} 