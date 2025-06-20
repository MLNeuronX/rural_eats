"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting forgot password for:", email);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    console.log("Response status:", res.status);
    if (res.ok) {
      setSent(true);
      toast({ title: "Check your email for a reset link." });
    } else {
      toast({ title: "Error", description: "Could not send reset link.", variant: "destructive" });
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
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      )}
    </div>
  );
} 