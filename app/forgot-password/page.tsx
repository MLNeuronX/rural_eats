"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast-provider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
    // Ensure baseApiUrl doesn't end with /api to prevent double /api/api/ issue
    const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;
    try {
      const response = await fetch(`${cleanBaseUrl}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSent(true);
        showToast('success', "Check your email for a password reset link.");
      } else {
        showToast('error', "Failed to send reset link. Please check your email and try again.");
      }
    } catch (error) {
      showToast('error', "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {sent ? (
        <p>Check your email for a password reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </div>
  );
}