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

// Toast utility function
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

export const showToast = (type: ToastType, message: string) => {
  switch (type) {
    case 'success':
      return toast.success(message)
    case 'error':
      return toast.error(message)
    case 'info':
      return toast.info(message)
    case 'warning':
      return toast.warning(message)
    case 'loading':
      return toast.loading(message)
    default:
      return toast(message)
  }
}

// Order-specific toast functions
export const orderToasts = {
  statusUpdated: (status: string) => showToast('success', `Order status updated to ${status}`),
  orderCreated: () => showToast('success', "Order placed successfully!"),
  paymentSuccess: () => showToast('success', "Payment processed successfully!"),
  paymentError: () => showToast('error', "Payment failed. Please try again."),
  driverAssigned: (driverName: string) => showToast('success', `Driver ${driverName} assigned to your order`),
  orderDelivered: () => showToast('success', "Order delivered successfully!"),
  error: (message: string) => showToast('error', message),
}