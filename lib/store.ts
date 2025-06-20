"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"

export interface MenuItem {
  id: string
  vendorId: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  buyerId: string
  vendorId: string
  driverId?: string
  items: Array<{
    menuItemId: string
    name: string
    price: number
    quantity: number
    specialInstructions?: string
  }>
  status: OrderStatus
  total: number
  deliveryFee: number
  deliveryAddress: string
  deliveryTime?: string
  createdAt: string
  updatedAt: string
  estimatedDeliveryTime?: string
  vendorName: string
  buyerName: string
  buyerPhone: string
}

export interface Vendor {
  id: string
  name: string
  description: string
  image: string
  cuisineType: string
  rating: number
  deliveryFee: number
  minimumOrder: number
  estimatedDeliveryTime: string
  address: string
  phone: string
  isOpen: boolean
  openingTime: string
  closingTime: string
  priceRange: "low" | "medium" | "high"
}

export interface Driver {
  id: string
  name: string
  phone: string
  rating: number
  totalDeliveries: number
  isOnline: boolean
  currentLocation: string
  profileImage: string
  vehicleType: string
  estimatedArrival?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "buyer" | "vendor" | "driver" | "admin"
  address?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}

interface AppState {
  // User & Auth
  currentUser: User | null
  token: string | null
  setCurrentUser: (user: User | null) => void
  setToken: (token: string | null) => void

  // Cart Management
  cart: CartItem[]
  vendorId: string | null
  addToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void
  updateCartQuantity: (menuItemId: string, quantity: number) => void
  removeFromCart: (menuItemId: string) => void
  clearCart: () => void
  getCartTotal: () => number

  // Menu Management
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  getMenuItemsByVendor: (vendorId: string) => MenuItem[]

  // Order Management
  orders: Order[]
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus, driverId?: string) => void
  assignDriver: (orderId: string, driverId: string) => void
  getOrdersByUser: (userId: string, role: string) => Order[]
  getOrderById: (orderId: string) => Order | undefined

  // Vendor Management
  vendors: Vendor[]
  updateVendorStatus: (vendorId: string, isOpen: boolean) => void
  getVendorById: (vendorId: string) => Vendor | undefined

  // Driver Management
  drivers: Driver[]
  updateDriverStatus: (driverId: string, isOnline: boolean) => void
  getAvailableDrivers: () => Driver[]

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  markNotificationRead: (notificationId: string) => void
  getUnreadCount: (userId: string) => number

  // Admin Functions
  getAllOrders: () => Order[]
  getAllUsers: () => User[]
  getTodayRevenue: () => number
}

const mockVendors: Vendor[] = [
  {
    id: "v1",
    name: "Mary's Diner",
    description: "Classic American comfort food",
    image: "/placeholder.svg?height=200&width=300",
    cuisineType: "American",
    rating: 4.8,
    deliveryFee: 2.99,
    minimumOrder: 15,
    estimatedDeliveryTime: "25-35 min",
    address: "123 Main St, Rural Town",
    phone: "+1 555-0123",
    isOpen: true,
    openingTime: "7:00 AM",
    closingTime: "9:00 PM",
    priceRange: "medium",
  },
  {
    id: "v2",
    name: "Pizza Palace",
    description: "Authentic wood-fired pizzas",
    image: "/placeholder.svg?height=200&width=300",
    cuisineType: "Italian",
    rating: 4.6,
    deliveryFee: 3.49,
    minimumOrder: 20,
    estimatedDeliveryTime: "30-40 min",
    address: "456 Oak Ave, Rural Town",
    phone: "+1 555-0124",
    isOpen: true,
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    priceRange: "medium",
  },
]

const mockMenuItems: MenuItem[] = [
  {
    id: "m1",
    vendorId: "v1",
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, tomato, and our special sauce",
    price: 12.99,
    category: "Burgers",
    image: "/placeholder.svg?height=150&width=200",
    available: true,
  },
  {
    id: "m2",
    vendorId: "v1",
    name: "Chicken Caesar Salad",
    description: "Fresh romaine lettuce with grilled chicken, parmesan, and caesar dressing",
    price: 10.99,
    category: "Salads",
    image: "/placeholder.svg?height=150&width=200",
    available: true,
  },
  {
    id: "m3",
    vendorId: "v2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on wood-fired crust",
    price: 16.99,
    category: "Pizzas",
    image: "/placeholder.svg?height=150&width=200",
    available: true,
  },
]

const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "John Driver",
    phone: "+1 555-0201",
    rating: 4.9,
    totalDeliveries: 247,
    isOnline: true,
    currentLocation: "Downtown Rural Town",
    profileImage: "/placeholder.svg?height=100&width=100",
    vehicleType: "Car",
    estimatedArrival: "5 min",
  },
  {
    id: "d2",
    name: "Sarah Delivery",
    phone: "+1 555-0202",
    rating: 4.8,
    totalDeliveries: 189,
    isOnline: true,
    currentLocation: "North Rural Town",
    profileImage: "/placeholder.svg?height=100&width=100",
    vehicleType: "Bike",
    estimatedArrival: "8 min",
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User & Auth
      currentUser: null,
      token: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      setToken: (token) => set({ token }),

      // Cart Management
      cart: [],
      vendorId: null,
      addToCart: (item, quantity, specialInstructions) => {
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (cartItem) => cartItem.menuItem.id === item.id
          )

          if (existingItemIndex > -1) {
            const updatedCart = state.cart.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            )
            return { cart: updatedCart, vendorId: item.vendorId }
        } else {
            return {
            cart: [...state.cart, { menuItem: item, quantity, specialInstructions }],
            vendorId: item.vendorId,
            }
        }
        })
      },
      updateCartQuantity: (menuItemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity } : item
          ),
        })),
      removeFromCart: (menuItemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.menuItem.id !== menuItemId),
        })),
      clearCart: () => set({ cart: [], vendorId: null }),
      getCartTotal: () => {
        const state = get()
        return state.cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
      },

      // Menu Management
      menuItems: mockMenuItems,
      addMenuItem: (item) => {
        const newItem = { ...item, id: `m${Date.now()}` }
        set((state) => ({ menuItems: [...state.menuItems, newItem] }))
      },
      updateMenuItem: (id, updates) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }))
      },
      deleteMenuItem: (id) => {
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id),
        }))
      },
      getMenuItemsByVendor: (vendorId) => {
        const state = get()
        return state.menuItems.filter((item) => item.vendorId === vendorId)
      },

      // Order Management
      orders: [],
      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ orders: [...state.orders, newOrder] }))

        // Add notifications
        const { addNotification } = get()
        addNotification({
          userId: orderData.vendorId,
          title: "New Order Received",
          message: `Order #${newOrder.id} from ${orderData.buyerName}`,
          type: "info",
          read: false,
        })

        return newOrder
      },
      updateOrderStatus: (orderId, status, driverId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status, driverId, updatedAt: new Date().toISOString() } : order,
          ),
        }))

        // Add status change notifications
        const { addNotification, orders } = get()
        const order = orders.find((o) => o.id === orderId)
        if (order) {
          // Notify buyer
          addNotification({
            userId: order.buyerId,
            title: "Order Status Updated",
            message: `Your order #${orderId} is now ${status.toLowerCase().replace("_", " ")}`,
            type: "info",
            read: false,
          })

          // Notify driver if assigned
          if (driverId && status === "ASSIGNED") {
            addNotification({
              userId: driverId,
              title: "New Delivery Assignment",
              message: `You've been assigned order #${orderId}`,
              type: "success",
              read: false,
            })
          }
        }
      },
      assignDriver: (orderId, driverId) => {
        get().updateOrderStatus(orderId, "ASSIGNED", driverId)
      },
      getOrdersByUser: (userId, role) => {
        const state = get()
        switch (role) {
          case "buyer":
            return state.orders.filter((order) => order.buyerId === userId)
          case "vendor":
            return state.orders.filter((order) => order.vendorId === userId)
          case "driver":
            return state.orders.filter((order) => order.driverId === userId)
          default:
            return state.orders
        }
      },
      getOrderById: (orderId) => {
        const state = get()
        return state.orders.find((order) => order.id === orderId)
      },

      // Vendor Management
      vendors: mockVendors,
      updateVendorStatus: (vendorId, isOpen) => {
        set((state) => ({
          vendors: state.vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, isOpen } : vendor)),
        }))
      },
      getVendorById: (vendorId) => {
        const state = get()
        return state.vendors.find((vendor) => vendor.id === vendorId)
      },

      // Driver Management
      drivers: mockDrivers,
      updateDriverStatus: (driverId, isOnline) => {
        set((state) => ({
          drivers: state.drivers.map((driver) => (driver.id === driverId ? { ...driver, isOnline } : driver)),
        }))
      },
      getAvailableDrivers: () => {
        const state = get()
        return state.drivers.filter((driver) => driver.isOnline)
      },

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `n${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ notifications: [...state.notifications, newNotification] }))
      },
      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification,
          ),
        }))
      },
      getUnreadCount: (userId) => {
        const state = get()
        return state.notifications.filter((n) => n.userId === userId && !n.read).length
      },

      // Admin Functions
      getAllOrders: () => get().orders,
      getAllUsers: () => {
        // Mock users for admin view
        return [
          { id: "b1", name: "John Buyer", email: "buyer@example.com", phone: "+1 555-0100", role: "buyer" as const },
          {
            id: "v1",
            name: "Mary's Diner",
            email: "vendor@example.com",
            phone: "+1 555-0123",
            role: "vendor" as const,
          },
          { id: "d1", name: "John Driver", email: "driver@example.com", phone: "+1 555-0201", role: "driver" as const },
        ]
      },
      getTodayRevenue: () => {
        const state = get()
        const today = new Date().toDateString()
        return state.orders
          .filter((order) => new Date(order.createdAt).toDateString() === today && order.status === "DELIVERED")
          .reduce((total, order) => total + order.total, 0)
      },
    }),
    {
      name: "rural-eats-store",
      partialize: (state) => ({
        cart: state.cart,
        vendorId: state.vendorId,
        orders: state.orders,
        menuItems: state.menuItems,
        vendors: state.vendors,
        drivers: state.drivers,
        notifications: state.notifications,
        currentUser: state.currentUser,
      }),
    },
  ),
)
