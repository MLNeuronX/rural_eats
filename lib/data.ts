// Types
export type OrderStatus = "NEW" | "CONFIRMED" | "PREPARING" | "READY" | "DRIVER_ASSIGNED" | "DRIVER_ACCEPTED" | "ACCEPTED" | "ASSIGNED" | "OUT_FOR_DELIVERY" | "DELIVERED"

export interface MenuItem {
  id: string
  vendorId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

export interface Vendor {
  id: string
  name: string
  description: string
  image: string
  address: string
  cuisineType: string
  priceRange: "low" | "medium" | "high"
  rating: number
  isOpen: boolean
  openingTime: string
  closingTime: string
  deliveryFee: number
}

export interface Order {
  id: string
  buyerId: string
  vendorId: string
  driverId: string | null
  items: {
    menuItemId: string
    name: string
    price: number
    quantity: number
  }[]
  status: OrderStatus
  total: number
  tip?: number
  deliveryFee: number
  deliveryAddress: string
  deliveryTime: string | null
  createdAt: string
  updatedAt: string
  driver_assigned: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "vendor" | "driver" | "admin"
}

// Mock data
export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Mary's Diner",
    description: "Classic American comfort food",
    image: "/placeholder.svg?height=100&width=100",
    address: "123 Main St, Rural Town",
    cuisineType: "American",
    priceRange: "medium",
    rating: 4.5,
    isOpen: true,
    openingTime: "07:00",
    closingTime: "21:00",
    deliveryFee: 3.99,
  },
  {
    id: "v2",
    name: "Taco Shack",
    description: "Authentic Mexican street food",
    image: "/placeholder.svg?height=100&width=100",
    address: "456 Oak Ave, Rural Town",
    cuisineType: "Mexican",
    priceRange: "low",
    rating: 4.2,
    isOpen: true,
    openingTime: "10:00",
    closingTime: "22:00",
    deliveryFee: 2.99,
  },
  {
    id: "v3",
    name: "Pizza Palace",
    description: "Hand-tossed pizzas and Italian favorites",
    image: "/placeholder.svg?height=100&width=100",
    address: "789 Pine Rd, Rural Town",
    cuisineType: "Italian",
    priceRange: "medium",
    rating: 4.0,
    isOpen: true,
    openingTime: "11:00",
    closingTime: "23:00",
    deliveryFee: 3.49,
  },
  {
    id: "v4",
    name: "Sushi Express",
    description: "Fresh sushi and Japanese cuisine",
    image: "/placeholder.svg?height=100&width=100",
    address: "101 Cedar Ln, Rural Town",
    cuisineType: "Japanese",
    priceRange: "high",
    rating: 4.7,
    isOpen: false,
    openingTime: "12:00",
    closingTime: "22:00",
    deliveryFee: 4.99,
  },
  {
    id: "v5",
    name: "Burger Barn",
    description: "Farm-fresh burgers and fries",
    image: "/placeholder.svg?height=100&width=100",
    address: "202 Elm St, Rural Town",
    cuisineType: "American",
    priceRange: "low",
    rating: 4.3,
    isOpen: true,
    openingTime: "11:00",
    closingTime: "22:00",
    deliveryFee: 2.49,
  },
  {
    id: "v6",
    name: "Thai Delight",
    description: "Authentic Thai cuisine",
    image: "/placeholder.svg?height=100&width=100",
    address: "303 Maple Dr, Rural Town",
    cuisineType: "Thai",
    priceRange: "medium",
    rating: 4.6,
    isOpen: true,
    openingTime: "11:30",
    closingTime: "21:30",
    deliveryFee: 3.99,
  },
  {
    id: "v7",
    name: "Country Kitchen",
    description: "Homestyle cooking and baked goods",
    image: "/placeholder.svg?height=100&width=100",
    address: "404 Walnut Ave, Rural Town",
    cuisineType: "American",
    priceRange: "medium",
    rating: 4.4,
    isOpen: true,
    openingTime: "06:00",
    closingTime: "20:00",
    deliveryFee: 2.99,
  },
  {
    id: "v8",
    name: "Pho House",
    description: "Vietnamese soups and noodles",
    image: "/placeholder.svg?height=100&width=100",
    address: "505 Birch St, Rural Town",
    cuisineType: "Vietnamese",
    priceRange: "low",
    rating: 4.1,
    isOpen: false,
    openingTime: "10:00",
    closingTime: "21:00",
    deliveryFee: 3.49,
  },
  {
    id: "v9",
    name: "BBQ Pit",
    description: "Slow-smoked meats and sides",
    image: "/placeholder.svg?height=100&width=100",
    address: "606 Hickory Ln, Rural Town",
    cuisineType: "BBQ",
    priceRange: "medium",
    rating: 4.8,
    isOpen: true,
    openingTime: "11:00",
    closingTime: "22:00",
    deliveryFee: 3.99,
  },
  {
    id: "v10",
    name: "Indian Spice",
    description: "Authentic Indian curries and breads",
    image: "/placeholder.svg?height=100&width=100",
    address: "707 Spruce Rd, Rural Town",
    cuisineType: "Indian",
    priceRange: "high",
    rating: 4.5,
    isOpen: true,
    openingTime: "12:00",
    closingTime: "22:00",
    deliveryFee: 4.49,
  },
]

export const menuItems: MenuItem[] = [
  // Mary's Diner
  {
    id: "m1",
    vendorId: "v1",
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, tomato, and special sauce",
    price: 8.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Burgers",
    available: true,
  },
  {
    id: "m2",
    vendorId: "v1",
    name: "Chicken Fried Steak",
    description: "Breaded steak with country gravy, mashed potatoes, and vegetables",
    price: 12.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Entrees",
    available: true,
  },
  {
    id: "m3",
    vendorId: "v1",
    name: "Chocolate Milkshake",
    description: "Thick and creamy chocolate shake with whipped cream",
    price: 4.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Drinks",
    available: true,
  },

  // Taco Shack
  {
    id: "m4",
    vendorId: "v2",
    name: "Street Tacos",
    description: "Three corn tortillas with choice of meat, onions, and cilantro",
    price: 7.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Tacos",
    available: true,
  },
  {
    id: "m5",
    vendorId: "v2",
    name: "Burrito Supreme",
    description: "Large flour tortilla filled with meat, beans, rice, cheese, and sour cream",
    price: 9.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Burritos",
    available: true,
  },

  // Pizza Palace
  {
    id: "m6",
    vendorId: "v3",
    name: "Pepperoni Pizza",
    description: "Classic pepperoni pizza with mozzarella cheese",
    price: 12.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Pizzas",
    available: true,
  },
  {
    id: "m7",
    vendorId: "v3",
    name: "Spaghetti & Meatballs",
    description: "Spaghetti with homemade meatballs and marinara sauce",
    price: 10.99,
    image: "/placeholder.svg?height=100&width=100",
    category: "Pasta",
    available: true,
  },
]

// Sample orders
export const orders: Order[] = [
  {
    id: "o1",
    buyerId: "b1",
    vendorId: "v1",
    driverId: null,
    items: [
      {
        menuItemId: "m1",
        name: "Classic Cheeseburger",
        price: 8.99,
        quantity: 2,
      },
      {
        menuItemId: "m3",
        name: "Chocolate Milkshake",
        price: 4.99,
        quantity: 2,
      },
    ],
    status: "NEW",
    total: 27.96,
    tip: 2.00,
    deliveryFee: 3.99,
    deliveryAddress: "123 Customer St, Rural Town",
    deliveryTime: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    driver_assigned: false,
  },
  {
    id: "o2",
    buyerId: "b1",
    vendorId: "v2",
    driverId: "d1",
    items: [
      {
        menuItemId: "m4",
        name: "Street Tacos",
        price: 7.99,
        quantity: 1,
      },
      {
        menuItemId: "m5",
        name: "Burrito Supreme",
        price: 9.99,
        quantity: 1,
      },
    ],
    status: "PREPARING",
    total: 20.97,
    tip: 1.00,
    deliveryFee: 2.99,
    deliveryAddress: "123 Customer St, Rural Town",
    deliveryTime: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    driver_assigned: false,
  },
  {
    id: "o3",
    buyerId: "b2",
    vendorId: "v3",
    driverId: "d1",
    items: [
      {
        menuItemId: "m6",
        name: "Pepperoni Pizza",
        price: 12.99,
        quantity: 1,
      },
    ],
    status: "READY",
    total: 16.48,
    tip: 0.50,
    deliveryFee: 3.49,
    deliveryAddress: "456 Customer Ave, Rural Town",
    deliveryTime: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    driver_assigned: false,
  },
  {
    id: "o4",
    buyerId: "b1",
    vendorId: "v1",
    driverId: "d2",
    items: [
      {
        menuItemId: "m2",
        name: "Chicken Fried Steak",
        price: 12.99,
        quantity: 1,
      },
    ],
    status: "OUT_FOR_DELIVERY",
    total: 16.98,
    tip: 0.50,
    deliveryFee: 3.99,
    deliveryAddress: "123 Customer St, Rural Town",
    deliveryTime: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    driver_assigned: false,
  },
  {
    id: "o5",
    buyerId: "b3",
    vendorId: "v5",
    driverId: "d2",
    items: [
      {
        menuItemId: "m8",
        name: "Double Cheeseburger",
        price: 10.99,
        quantity: 2,
      },
    ],
    status: "DELIVERED",
    total: 24.47,
    tip: 1.00,
    deliveryFee: 2.49,
    deliveryAddress: "789 Customer Blvd, Rural Town",
    deliveryTime: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    driver_assigned: false,
  },
]

// Helper functions to simulate API calls
export async function getVendors(filters?: {
  cuisineType?: string
  priceRange?: string
  isOpen?: boolean
}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredVendors = [...vendors]

  if (filters) {
    if (filters.cuisineType) {
      filteredVendors = filteredVendors.filter((v) => v.cuisineType === filters.cuisineType)
    }

    if (filters.priceRange) {
      filteredVendors = filteredVendors.filter((v) => v.priceRange === filters.priceRange)
    }

    if (filters.isOpen !== undefined) {
      filteredVendors = filteredVendors.filter((v) => v.isOpen === filters.isOpen)
    }
  }

  return filteredVendors
}

export async function getVendorById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return vendors.find((v) => v.id === id) || null
}

export async function getMenuItems(vendorId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return menuItems.filter((item) => item.vendorId === vendorId)
}

export async function getOrdersByBuyer(buyerId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return orders.filter((order) => order.buyerId === buyerId)
}

export async function getOrdersByVendor(vendorId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return orders.filter((order) => order.vendorId === vendorId)
}

export async function getOrdersByDriver(driverId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return orders.filter((order) => order.driverId === driverId)
}

export async function getReadyOrders() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return orders.filter((order) => order.status === "READY" && !order.driverId)
}

export async function getOrderById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return orders.find((order) => order.id === id) || null
}

export async function updateOrderStatus(id: string, status: OrderStatus, driverId?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const orderIndex = orders.findIndex((order) => order.id === id)
  if (orderIndex === -1) return null

  const updatedOrder = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString(),
  }

  if (driverId) {
    updatedOrder.driverId = driverId
  }

  orders[orderIndex] = updatedOrder
  return updatedOrder
}

export async function createMenuItem(item: Omit<MenuItem, "id">) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newItem: MenuItem = {
    ...item,
    id: `m${menuItems.length + 1}`,
  }

  menuItems.push(newItem)
  return newItem
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const itemIndex = menuItems.findIndex((item) => item.id === id)
  if (itemIndex === -1) return null

  const updatedItem = {
    ...menuItems[itemIndex],
    ...updates,
  }

  menuItems[itemIndex] = updatedItem
  return updatedItem
}

export async function deleteMenuItem(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const itemIndex = menuItems.findIndex((item) => item.id === id)
  if (itemIndex === -1) return false

  menuItems.splice(itemIndex, 1)
  return true
}

export async function createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const newOrder: Order = {
    ...order,
    id: `o${orders.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    driver_assigned: false,
  }

  orders.push(newOrder)
  return newOrder
}

export async function updateVendorAvailability(id: string, isOpen: boolean) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const vendorIndex = vendors.findIndex((v) => v.id === id)
  if (vendorIndex === -1) return null

  vendors[vendorIndex] = {
    ...vendors[vendorIndex],
    isOpen,
  }

  return vendors[vendorIndex]
}

export async function assignOrderToDriver(orderId: string, driverId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const orderIndex = orders.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) return null

  const updatedOrder = {
    ...orders[orderIndex],
    driverId,
    status: "ASSIGNED" as const,
    updatedAt: new Date().toISOString(),
    driver_assigned: true,
  }

  orders[orderIndex] = updatedOrder
  return updatedOrder
}

// Add API call for vendor accept order
export async function vendorAcceptOrder(orderId: string) {
  const res = await fetch(`/api/vendor/orders/${orderId}/accept`, { method: "POST" })
  if (!res.ok) throw new Error("Failed to accept order")
  return res.json()
}

// Add API call for driver accept assignment
export async function driverAcceptAssignment(orderId: string) {
  const res = await fetch(`/api/driver/orders/${orderId}/accept`, { method: "POST" })
  if (!res.ok) throw new Error("Failed to accept assignment")
  return res.json()
}
