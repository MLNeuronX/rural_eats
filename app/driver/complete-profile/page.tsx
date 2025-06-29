"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast-provider";
import { authFetch } from "@/lib/utils";

export default function DriverCompleteProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !phone || !vehicleDetails) {
      setError("All fields are required.");
      return;
    }
    if (phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/driver/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          vehicle_details: vehicleDetails,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to complete profile.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      showToast('success', 'Profile completed! You can now go online.');
      setTimeout(() => router.push("/driver"), 1500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profile Completed!</h1>
        <p className="mb-4">You can now go online and start accepting deliveries.</p>
        <Button onClick={() => router.push("/driver")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Your Driver Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Vehicle Details"
          value={vehicleDetails}
          onChange={e => setVehicleDetails(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
} 