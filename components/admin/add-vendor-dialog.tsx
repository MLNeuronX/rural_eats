import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast-provider";

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVendor: (vendor: {
    business_name: string;
    address: string;
    phone: string;
    cuisine_type: string;
    price_range: string;
    opening_time: string;
    closing_time: string;
    delivery_fee: string;
    email: string;
    password: string;
  }) => Promise<{ id: string } | undefined>;
}

export default function AddVendorDialog({ open, onOpenChange, onAddVendor }: AddVendorDialogProps) {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const vendor = await onAddVendor({
        business_name: businessName,
        address,
        phone,
        cuisine_type: cuisineType,
        price_range: priceRange,
        opening_time: openingTime,
        closing_time: closingTime,
        delivery_fee: deliveryFee,
        email,
        password,
      });
      if (vendor && vendor.id) {
        const link = `${window.location.origin}/vendor/complete-profile?vendorId=${vendor.id}`;
        setRegistrationLink(link);
        try {
          await navigator.clipboard.writeText(link);
          showToast.success("Registration link copied to clipboard! Link: " + link);
        } catch {
          showToast.success("Registration link generated! Link: " + link);
        }
      }
      setBusinessName("");
      setAddress("");
      setPhone("");
      setCuisineType("");
      setPriceRange("");
      setOpeningTime("");
      setClosingTime("");
      setDeliveryFee("");
      setEmail("");
      setPassword("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to add vendor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRegistrationLink("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Vendor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Business Name"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            required
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
          />
          <Input
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
          <Input
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <Input
            placeholder="Cuisine Type"
            value={cuisineType}
            onChange={e => setCuisineType(e.target.value)}
            required
          />
          <Input
            placeholder="Enter price range (e.g. 130-150$, 50$, 200-300$)"
            value={priceRange}
            onChange={e => setPriceRange(e.target.value)}
            required
          />
          <Input
            placeholder="Opening Time (e.g. 09:00)"
            value={openingTime}
            onChange={e => setOpeningTime(e.target.value)}
            required
          />
          <Input
            placeholder="Closing Time (e.g. 22:00)"
            value={closingTime}
            onChange={e => setClosingTime(e.target.value)}
            required
          />
          <Input
            placeholder="Delivery Fee"
            value={deliveryFee}
            onChange={e => setDeliveryFee(e.target.value)}
            required
            type="number"
            min="0"
            step="0.01"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Vendor"}
            </Button>
          </DialogFooter>
        </form>
        {registrationLink && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <div className="mb-2 font-semibold">Registration Link for Vendor:</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={registrationLink}
                readOnly
                className="flex-1 px-2 py-1 border rounded"
                style={{ minWidth: 0 }}
              />
              <Button type="button" onClick={() => {navigator.clipboard.writeText(registrationLink)}}>
                Copy Link
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Send this link to the vendor so they can complete their registration and set their password.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 