"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://rural-eats-backend.onrender.com";
      const res = await fetch(`${baseApiUrl}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log("Response status:", res.status);
      if (res.ok) {
        setSent(true);
      }
    } catch (error) {
      console.error("Error submitting forgot password:", error);
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
          {/* <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          /> */}
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          {/* <Button type="submit" className="w-full">Send Reset Link</Button> */}
          <input type="submit" className="w-full bg-blue-500 text-white py-2 rounded" value="Send Reset Link" />
        </form>
      )}
    </div>
  );
} 