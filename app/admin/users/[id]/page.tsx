"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/components/ui/toast-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params?.id;
  const isEdit = searchParams.get("edit") === "1";
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        setForm(data);
      } catch (err) {
        showToast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          status: form.status,
        }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      showToast.success("User updated!");
      router.replace(`/admin/users/${userId}`);
    } catch (err) {
      showToast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading user details...</div>;
  if (!user) return <div className="p-8 text-red-500">User not found.</div>;

  if (isEdit && form) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <Input name="name" value={form.name || ""} onChange={handleChange} placeholder="Name" />
          <Input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" />
          <Input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Phone" />
          <Input name="role" value={form.role || ""} onChange={handleChange} placeholder="Role (buyer, vendor, driver, admin)" />
          <Input name="status" value={form.status || ""} onChange={handleChange} placeholder="Status (active, suspended, pending)" />
          <div className="flex gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => router.replace(`/admin/users/${userId}`)} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{user.name || user.email}</h1>
          <div className="mb-2 text-muted-foreground">ID: <span className="font-mono">{user.id}</span></div>
          <div className="mb-2">Email: {user.email}</div>
          <div className="mb-2">Role: <span className="font-semibold">{user.role}</span></div>
          <div className="mb-2">Phone: {user.phone || "-"}</div>
          <Button className="mt-4" onClick={() => router.replace(`/admin/users/${userId}?edit=1`)}>Edit</Button>
        </CardContent>
      </Card>

      {/* Vendor Profile */}
      {user.role === "vendor" && user.vendor_profile && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">Vendor Profile</h2>
            <div>Business Name: {user.vendor_profile.business_name}</div>
            <div>Address: {user.vendor_profile.address}</div>
            <div>Phone: {user.vendor_profile.phone}</div>
            <div>Verified: {user.vendor_profile.is_verified ? "Yes" : "No"}</div>
          </CardContent>
        </Card>
      )}

      {/* Driver Info */}
      {user.role === "driver" && user.driver_profile && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">Driver Info</h2>
            <div>Name: {user.driver_profile.name}</div>
            <div>Email: {user.driver_profile.email}</div>
            <div>Phone: {user.driver_profile.phone}</div>
            <div>Vehicle Type: {user.driver_profile.vehicle_type || "-"}</div>
          </CardContent>
        </Card>
      )}

      {/* Orders */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          {user.orders && user.orders.length > 0 ? (
            <div className="space-y-2">
              {user.orders.map((order) => (
                <div key={order.id} className="border rounded p-2">
                  <div>Status: <span className="font-semibold">{order.status}</span></div>
                  <div>Total: ${order.total_amount}</div>
                  <div>Vendor: {order.vendor_id}</div>
                  <div>Order ID: <span className="font-mono">{order.id}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No orders found for this user.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 