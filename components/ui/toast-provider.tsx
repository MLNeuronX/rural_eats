"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

// Toast utility functions
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId: string | number) => toast.dismiss(toastId),
}

// Order-specific toast functions
export const orderToasts = {
  statusUpdated: (status: string) => showToast.success(`Order status updated to ${status}`),
  orderCreated: () => showToast.success("Order placed successfully!"),
  paymentSuccess: () => showToast.success("Payment processed successfully!"),
  paymentError: () => showToast.error("Payment failed. Please try again."),
  driverAssigned: (driverName: string) => showToast.success(`Driver ${driverName} assigned to your order`),
  orderDelivered: () => showToast.success("Order delivered successfully!"),
  error: (message: string) => showToast.error(message),
} 