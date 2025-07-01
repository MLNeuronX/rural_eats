"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getDriverById, updateDriver } from "@/lib/data";

export default function DriverDetailPage({ params }: { params: { id: string } }) {
  const [driver, setDriver] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";

  useEffect(() => {
    async function fetchDriver() {
      setLoading(true);
      try {
        const found = await getDriverById(params.id);
        setDriver(found || null);
        setForm({
          ...found,
          vehicleType: found?.vehicle_type || "", // frontend field
        });
      } catch (err) {
        console.error("Failed to fetch driver", err);
      }
      setLoading(false);
    }
    fetchDriver();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      vehicle_type: form.vehicleType,
    };

    try {
      const updated = await updateDriver(params.id, payload);
      setDriver(updated);
      toast.success("Driver updated!");
      router.replace(`/admin/drivers/${params.id}`);
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err.message || "Failed to update driver");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading driver details...</div>;
  if (!driver) return <div className="p-8 text-red-500">Driver not found.</div>;

  if (isEdit && form) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Driver</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <Input name="name" value={form.name || ""} onChange={handleChange} placeholder="Driver Name" />
          <Input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" />
          <Input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Phone" />
          <Input name="vehicleType" value={form.vehicleType || ""} onChange={handleChange} placeholder="Vehicle Type" />
          <div className="flex gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => router.replace(`/admin/drivers/${params.id}`)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{driver.name}</h1>
      <div className="mb-2 text-muted-foreground">
        ID: <span className="font-mono">{driver.id}</span>
      </div>
      <div className="mb-2">Email: {driver.email}</div>
      <div className="mb-2">Phone: {driver.phone}</div>
      <div className="mb-2">Vehicle: {driver.vehicle_type}</div>
      <div className="mb-2">Status: {driver.isActive ? "Active" : "Suspended"}</div>
      <div className="mb-2">Online: {driver.isOnline ? "Yes" : "No"}</div>
    </div>
  );
}
