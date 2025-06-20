"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface Toast {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

interface NotificationContextType {
  showToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getColorClasses = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <NotificationContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`
                max-w-sm w-full bg-white rounded-lg border shadow-lg p-4
                ${getColorClasses(toast.type)}
              `}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">{getIcon(toast.type)}</div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium">{toast.title}</p>
                  <p className="mt-1 text-sm opacity-90">{toast.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
