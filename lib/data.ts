import { authFetch } from "@/lib/utils";


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
  // Enriched data from backend
  buyer?: {
    id: string
    name: string
    email: string
  } | null
  vendor?: {
    id: string
    business_name: string
    user_id: string
  } | null
  driver?: {
    id: string
    name: string
    email: string
  } | null
}

export interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "vendor" | "driver" | "admin"
}

// API functions for vendors
export async function getVendors(filters?: {
  cuisineType?: string
  priceRange?: string
  isOpen?: boolean
}) {
  console.log("Fetching vendors from backend...");
  try {
    // Build query parameters for filters
    const queryParams = new URLSearchParams();
    if (filters?.cuisineType) queryParams.append('cuisine_type', filters.cuisineType);
    if (filters?.priceRange) queryParams.append('price_range', filters.priceRange);
    if (filters?.isOpen !== undefined) queryParams.append('is_open', filters.isOpen.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    // Ensure baseApiUrl doesn't end with /api to prevent double /api/ issue
    const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;
    const res = await fetch(`${cleanBaseUrl}/api/vendors${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!res.ok) throw new Error("Failed to fetch vendors");
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return data.map((vendor: any) => ({
      id: vendor.id,
      name: vendor.business_name || 'Unnamed Vendor',
      address: vendor.address || '',
      phone: vendor.phone || '',
      isOpen: vendor.is_open ?? false,
      isVerified: vendor.is_verified ?? false,
      cuisineType: vendor.cuisine_type || 'N/A',
      priceRange: vendor.price_range || '$$',
      rating: vendor.rating ?? 0,
      deliveryFee: vendor.delivery_fee ?? 0,
      openingTime: vendor.opening_time || 'N/A',
      closingTime: vendor.closing_time || 'N/A',
      image: vendor.image || null,
      description: vendor.description || '',
      user: vendor.user || null,
    }));
  } catch (error) {
    console.error("getVendors error:", error);
    return [];
  }
}

export async function getAdminVendors() {
  try {
    console.log('getAdminVendors: Starting...')
    const res = await authFetch("/api/admin/vendors");
    console.log('getAdminVendors: Response status:', res.status)
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('getAdminVendors: Error response:', errorText)
      throw new Error("Failed to fetch vendors for admin");
    }
    
    const data = await res.json();
    console.log('getAdminVendors: Raw data:', data)
    
    // Defensive check: if data.data is not an array, return an empty array
    if (!Array.isArray(data.data)) {
      console.warn("getAdminVendors: API response's data property is not an array. Returning empty.", data)
      return []
    }

    // Map backend fields to frontend, providing safe defaults for missing fields
    const mapped = data.data.map((vendor: any) => ({
      id: vendor.id,
      name: vendor.business_name || 'Unnamed Vendor',
      address: vendor.address || '',
      phone: vendor.phone || '',
      isOpen: vendor.is_open || false,
      isVerified: vendor.is_verified || false,
      cuisineType: vendor.cuisine_type || 'N/A',
      priceRange: vendor.price_range || '$$',
      rating: vendor.rating || 0,
      deliveryFee: vendor.delivery_fee || 0,
      openingTime: vendor.opening_time || 'N/A',
      closingTime: vendor.closing_time || 'N/A',
      image: vendor.image || null,
      description: vendor.description || '',
      user: vendor.user || null,
    }))
    
    console.log('getAdminVendors: Mapped data:', mapped)
    return mapped
  } catch (error) {
    console.error("getAdminVendors error:", error)
    return []
  }
}

export async function getVendorById(id: string) {
  try {
    // Use the admin endpoint for admin vendor detail
    const res = await authFetch(`/api/admin/vendors/${id}`);
    if (!res.ok) throw new Error("Failed to fetch vendor");
    const vendor = await res.json();
    // Map backend fields to frontend as before
    return {
      id: vendor.id,
      name: vendor.business_name || 'Unnamed Vendor',
      address: vendor.address || '',
      phone: vendor.phone || '',
      isOpen: vendor.is_open || false,
      isVerified: vendor.is_verified || false,
      cuisineType: vendor.cuisine_type || 'N/A',
      priceRange: vendor.price_range || '$$',
      rating: vendor.rating || 0,
      deliveryFee: vendor.delivery_fee || 0,
      openingTime: vendor.opening_time || 'N/A',
      closingTime: vendor.closing_time || 'N/A',
      image: vendor.image || null,
      description: vendor.description || '',
      user: vendor.user || null,
      email: vendor.email || '',
    };
  } catch (error) {
    console.error("getVendorById error:", error);
    return null;
  }
}

export async function getMenuItems(vendorId: string) {
  try {
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    // Ensure baseApiUrl doesn't end with /api to prevent double /api/api/ issue
    const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;
    const res = await fetch(`${cleanBaseUrl}/api/menu/vendor/${vendorId}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!res.ok) {
      console.error("Failed to fetch menu items:", res.status, res.statusText);
  return [];
    }
    
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return (data.menu_items || []).map((item: any) => ({
      id: item.id,
      vendorId: item.vendor_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image_url || '/placeholder.svg?height=100&width=100',
      category: 'Uncategorized', // Backend doesn't have category field, use default
      available: item.is_available ?? true,
    }));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export async function getOrdersByBuyer(buyerId: string) {
  try {
    const res = await authFetch(`/api/order/buyer/orders`);
    if (!res.ok) throw new Error("Failed to fetch buyer orders");
    const data = await res.json();

    // Defensive: if data.orders is not an array, return []
    if (!data.orders || !Array.isArray(data.orders)) {
  return [];
    }

    return data.orders.map((order: any) => ({
      id: order.id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      driverId: order.driver_id,
      items: Array.isArray(order.items)
        ? order.items.map((item: any) => ({
            menuItemId: item.menu_item_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        : [],
      status: order.status,
      total: order.total,
      tip: order.tip,
      deliveryFee: order.delivery_fee,
      deliveryAddress: order.delivery_address,
      deliveryTime: order.delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      driver_assigned: !!order.driver_id
    }));
  } catch (error) {
    console.error("getOrdersByBuyer error:", error);
    return [];
  }
}

export async function getOrdersByVendor(vendorId: string) {
  try {
    const res = await authFetch(`/api/vendor/orders`);
    if (!res.ok) throw new Error("Failed to fetch vendor orders");
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return data.orders.map((order: any) => ({
      id: order.id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      driverId: order.driver_id,
      items: order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: order.status,
      total: order.total,
      tip: order.tip,
      deliveryFee: order.delivery_fee,
      deliveryAddress: order.delivery_address,
      deliveryTime: order.delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      driver_assigned: !!order.driver_id
    }));
  } catch (error) {
    console.error("getOrdersByVendor error:", error);
  return [];
  }
}

export async function getOrdersByDriver(driverId: string) {
  try {
    const res = await authFetch(`/api/driver/orders`);
    if (!res.ok) throw new Error("Failed to fetch driver orders");
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return data.orders.map((order: any) => ({
      id: order.id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      driverId: order.driver_id,
      items: order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: order.status,
      total: order.total,
      tip: order.tip,
      deliveryFee: order.delivery_fee,
      deliveryAddress: order.delivery_address,
      deliveryTime: order.delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      driver_assigned: !!order.driver_id
    }));
  } catch (error) {
    console.error("getOrdersByDriver error:", error);
  return [];
  }
}

export async function getReadyOrders() {
  try {
    const res = await authFetch(`/api/driver/available-orders`);
    if (!res.ok) throw new Error("Failed to fetch ready orders");
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return data.orders.map((order: any) => ({
      id: order.id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      driverId: order.driver_id,
      items: order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: order.status,
      total: order.total,
      tip: order.tip,
      deliveryFee: order.delivery_fee,
      deliveryAddress: order.delivery_address,
      deliveryTime: order.delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      driver_assigned: !!order.driver_id
    }));
  } catch (error) {
    console.error("getReadyOrders error:", error);
  return [];
  }
}

export async function getOrderById(id: string) {
  try {
    const res = await authFetch(`/api/order/orders/${id}`);
    if (!res.ok) throw new Error("Failed to fetch order");
    const data = await res.json();
    
    // Return the raw response from backend: { order, items }
    return data;
  } catch (error) {
    console.error("getOrderById error:", error);
  return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus, driverId?: string) {
  try {
    const payload: any = { status };
    if (driverId) payload.driver_id = driverId;
    
    const res = await authFetch(`/api/order/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) throw new Error("Failed to update order status");
    const order = await res.json();
    
    // Map backend fields to frontend fields
    return {
      id: order.id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      driverId: order.driver_id,
      items: order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: order.status,
      total: order.total,
      tip: order.tip,
      deliveryFee: order.delivery_fee,
      deliveryAddress: order.delivery_address,
      deliveryTime: order.delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      driver_assigned: !!order.driver_id
    };
  } catch (error) {
    console.error("updateOrderStatus error:", error);
  return null;
}
}

export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  try {
    // Validate vendorId
    if (!item.vendorId || item.vendorId.trim() === '') {
      console.error('Invalid vendor ID:', item.vendorId);
      throw new Error('Invalid vendor ID. Please refresh the page and try again.');
    }
    
    const backendItem = {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available,
    };
    
    const vendorIdPath = item.vendorId.trim();
    const apiUrl = `/api/menu/vendor/${vendorIdPath}/items`;
    
    console.log('Creating menu item with API URL:', apiUrl);
    
    const res = await authFetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendItem),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server response:', res.status, errorText);
      throw new Error(`Failed to create menu item: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return {
      id: data.id,
      vendorId: data.vendor_id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      image: data.image_url || '/placeholder.svg?height=100&width=100',
      category: 'Uncategorized', // Backend doesn't have category field, use default
      available: data.is_available ?? true,
    };
  } catch (error) {
    console.error("createMenuItem error:", error);
    throw error;
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  try {
    // Convert frontend field names to backend field names if needed
    const backendUpdates = {
      ...updates,
      vendor_id: updates.vendorId, // Convert vendorId to vendor_id if it exists
    };
    
    // Remove frontend-only fields
    if (backendUpdates.vendorId) delete backendUpdates.vendorId;
    
    const res = await authFetch(`/api/menu/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendUpdates),
    });
    
    if (!res.ok) throw new Error("Failed to update menu item");
    const data = await res.json();
    
    // Map backend fields to frontend fields
    return {
      id: data.menu_item.id,
      vendorId: data.menu_item.vendor_id,
      name: data.menu_item.name,
      description: data.menu_item.description || '',
      price: data.menu_item.price,
      image: data.menu_item.image_url || '/placeholder.svg?height=100&width=100',
      category: 'Uncategorized', // Backend doesn't have category field, use default
      available: data.menu_item.is_available ?? true,
    };
  } catch (error) {
    console.error("updateMenuItem error:", error);
  return null;
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const res = await authFetch(`/api/menu/items/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) throw new Error("Failed to delete menu item");
    return true;
  } catch (error) {
    console.error("deleteMenuItem error:", error);
  return false;
  }
}

export async function createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  try {
    // Convert frontend field names to backend field names
    // Now includes all fields that exist in the updated database schema
    const backendOrder = {
      vendor_id: order.vendorId,
      items: order.items.map(item => ({
        menu_item_id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      delivery_address: order.deliveryAddress,
      tip: order.tip || 0,
      delivery_time: order.deliveryTime,
    };
    
    const res = await authFetch(`/api/order/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendOrder),
    });
    
    if (!res.ok) throw new Error("Failed to create order");
    const response = await res.json();
    
    // Map backend fields to frontend fields
    return {
      id: response.order.id,
      buyerId: response.order.buyer_id,
      vendorId: response.order.vendor_id,
      driverId: response.order.driver_id,
      items: response.order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: response.order.status,
      total: response.order.total_amount,
      tip: response.order.tip_amount || 0,
      deliveryFee: response.order.delivery_fee || 0,
      deliveryAddress: response.order.delivery_address,
      deliveryTime: response.order.delivery_time,
      createdAt: response.order.created_at,
      updatedAt: response.order.updated_at,
      driver_assigned: response.order.driver_assigned || false
    };
  } catch (error) {
    console.error("createOrder error:", error);
  return null;
  }
}

export async function updateVendorAvailability(id: string, isOpen: boolean) {
  try {
    const res = await authFetch(`/api/admin/vendors/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendor_id: id, is_open: isOpen }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "An unknown error occurred" }));
      throw new Error(errorData.error || "Failed to update vendor availability");
    }
    const vendor = await res.json();
    // Map backend fields to frontend fields
    return {
      id: vendor.id,
      name: vendor.business_name || 'Unnamed Vendor',
      address: vendor.address || '',
      phone: vendor.phone || '',
      isOpen: vendor.is_open || false,
      isVerified: vendor.is_verified || false,
      cuisineType: vendor.cuisine_type || 'N/A',
      priceRange: vendor.price_range || '$$',
      rating: vendor.rating || 0,
      deliveryFee: vendor.delivery_fee || 0,
      openingTime: vendor.opening_time || 'N/A',
      closingTime: vendor.closing_time || 'N/A',
      image: vendor.image || null,
      description: vendor.description || '',
      user: vendor.user || null,
    };
  } catch (error) {
    console.error("updateVendorAvailability error:", error);
    throw error;
  }
}

export async function assignOrderToDriver(orderId: string, driverId: string) {
  try {
    const res = await authFetch(`/api/order/orders/${orderId}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ driver_id: driverId }),
    });
    
    if (!res.ok) throw new Error("Failed to assign order to driver");
    const order = await res.json();
    
    // Map backend fields to frontend fields
    return {
      id: order.id,
      buyerId: order.buyer_id,
      vendorId: order.vendor_id,
      driverId: order.driver_id,
      items: order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: order.status,
      total: order.total,
      tip: order.tip,
      deliveryFee: order.delivery_fee,
      deliveryAddress: order.delivery_address,
      deliveryTime: order.delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      driver_assigned: !!order.driver_id
    };
  } catch (error) {
    console.error("assignOrderToDriver error:", error);
  return null;
  }
}

// Add API call for vendor accept order
export async function vendorAcceptOrder(orderId: string) {
  try {
    const res = await authFetch(`/api/vendor/orders/${orderId}/accept`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to accept order");
    return res.json();
  } catch (error) {
    console.error("vendorAcceptOrder error:", error);
    throw error;
  }
}

// Add API call for driver accept assignment
export async function driverAcceptAssignment(orderId: string) {
  try {
    const res = await authFetch(`/api/driver/orders/${orderId}/accept`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to accept assignment");
    return res.json();
  } catch (error) {
    console.error("driverAcceptAssignment error:", error);
    throw error;
  }
}

export async function updateVendor(id: string, updates: any) {
  const res = await authFetch(`/api/admin/vendors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update vendor');
  return res.json();
}



export async function updateDriver(id: string, updates: any) {
  const res = await authFetch(`/api/admin/drivers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update driver');
  return res.json();
}

// In your lib/data.ts or similar file:
// Make sure this includes token if needed

export async function getDriverById(id: string) {
  const res = await authFetch(`/api/admin/drivers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch driver");
  return res.json();
}

// Fetch vendor by ID from the public endpoint (for buyer/public pages)
export async function getPublicVendorById(id: string) {
  try {
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    // Ensure baseApiUrl doesn't end with /api to prevent double /api/api/ issue
    const cleanBaseUrl = baseApiUrl.endsWith('/api') ? baseApiUrl.slice(0, -4) : baseApiUrl;
    const res = await fetch(`${cleanBaseUrl}/api/vendors/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error("Failed to fetch vendor");
    const vendor = await res.json();
    // Map backend fields to frontend as before
    return {
      id: vendor.id,
      name: vendor.business_name || 'Unnamed Vendor',
      address: vendor.address || '',
      phone: vendor.phone || '',
      isOpen: vendor.is_open || false,
      isVerified: vendor.is_verified || false,
      cuisineType: vendor.cuisine_type || 'N/A',
      priceRange: vendor.price_range || '$$',
      rating: vendor.rating || 0,
      deliveryFee: vendor.delivery_fee || 0,
      openingTime: vendor.opening_time || 'N/A',
      closingTime: vendor.closing_time || 'N/A',
      image: vendor.image || null,
      description: vendor.description || '',
      user: vendor.user || null,
      email: vendor.email || '',
    };
  } catch (error) {
    console.error("getPublicVendorById error:", error);
    return null;
  }
}
