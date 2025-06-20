import { apiRequest } from "./api";

// Vendor Registration
export async function registerVendor(email: string, password: string, business_name: string) {
  return await apiRequest(
    "/vendor/register",
    "POST",
    { email, password, business_name }
  );
}

// Vendor Login
export async function loginVendor(email: string, password: string) {
  return await apiRequest(
    "/vendor/login",
    "POST",
    { email, password }
  );
}

// Fetch Menu Items
export async function fetchMenuItems(token: string) {
  return await apiRequest("/vendor/menu/items", "GET", undefined, token);
}

// Add Menu Item
export async function addMenuItem(item: {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}, token: string) {
  return await apiRequest("/vendor/menu/items", "POST", item, token);
}

// Update Menu Item
export async function updateMenuItem(id: string, updates: any, token: string) {
  return await apiRequest(`/vendor/menu/items/${id}`, "PUT", updates, token);
}

// Delete Menu Item
export async function deleteMenuItem(id: string, token: string) {
  return await apiRequest(`/vendor/menu/items/${id}`, "DELETE", undefined, token);
}

// Fetch Vendor Orders
export async function fetchVendorOrders(token: string) {
  return await apiRequest("/vendor/orders", "GET", undefined, token);
} 