"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import { getVendorById, updateVendor } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast-provider';

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === '1';

  useEffect(() => {
    async function fetchVendor() {
      setLoading(true);
      const found = await getVendorById(params.id);
      setVendor(found || null);
      setForm(found || null);
      setLoading(false);
    }
    fetchVendor();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Map frontend fields to backend fields
    const mappedForm = {
      business_name: form.name,
      address: form.address,
      phone: form.phone,
      cuisine_type: form.cuisineType,
      price_range: form.priceRange,
      delivery_fee: Number(form.deliveryFee),
      opening_time: form.openingTime,
      closing_time: form.closingTime,
      description: form.description,
      image: form.image,
      is_open: form.isOpen,
      is_verified: form.isVerified,
      email: form.email,
    };

    try {
      await updateVendor(params.id, mappedForm);
      setVendor(form);
      showToast('success', 'Vendor updated!');
      router.replace('/admin/vendors');
    } catch (err) {
      showToast('error', 'Failed to update vendor');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading vendor details...</div>;
  if (!vendor) return <div className="p-8 text-red-500">Vendor not found.</div>;

  if (isEdit && form) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Vendor</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <Input name="name" value={form.name || ''} onChange={handleChange} placeholder="Vendor Name" />
          <Input name="address" value={form.address || ''} onChange={handleChange} placeholder="Address" />
          <Input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" />
          <Input name="cuisineType" value={form.cuisineType || ''} onChange={handleChange} placeholder="Cuisine" />
          <Input name="priceRange" value={form.priceRange || ''} onChange={handleChange} placeholder="Price Range" />
          <Input name="deliveryFee" value={form.deliveryFee || ''} onChange={handleChange} placeholder="Delivery Fee" type="number" />
          <Input name="openingTime" value={form.openingTime || ''} onChange={handleChange} placeholder="09:00" type="time" />
          <Input name="closingTime" value={form.closingTime || ''} onChange={handleChange} placeholder="22:00" type="time" />
          <Input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" />
          <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" className="w-full border rounded p-2" />
          <div className="flex gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => router.replace(`/admin/vendors/${params.id}`)} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{vendor.name}</h1>
      <div className="mb-2 text-muted-foreground">ID: <span className="font-mono">{vendor.id}</span></div>
      <div className="mb-2">Address: {vendor.address}</div>
      <div className="mb-2">Phone: {vendor.phone || 'N/A'}</div>
      <div className="mb-2">Status: {vendor.isOpen ? 'Open' : 'Closed'}</div>
      <div className="mb-2">Cuisine: {vendor.cuisineType}</div>
      <div className="mb-2">Price Range: {vendor.priceRange}</div>
      <div className="mb-2">Delivery Fee: ${vendor.deliveryFee}</div>
      <div className="mb-2">Rating: {vendor.rating}</div>
      <div className="mb-2">Hours: {vendor.openingTime} - {vendor.closingTime}</div>
      <div className="mb-2">Description: {vendor.description || 'N/A'}</div>
    </div>
  );
} 