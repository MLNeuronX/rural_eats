"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function VendorCompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to set password");
        setLoading(false);
        return;
      }
      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to set password");
      setLoading(false);
    }
  };

  if (!vendorId) {
    return <div className="p-8 text-red-500">Invalid registration link.</div>;
  }

  if (success) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profile Completed!</h1>
        <p className="mb-4">Your password has been set. You can now log in as a vendor.</p>
        <Button onClick={() => router.push("/vendor/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Set Your Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Set Password & Complete"}
        </Button>
      </form>
    </div>
  );
}

export default function VendorCompleteProfilePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <VendorCompleteProfileContent />
    </Suspense>
  );
} 