import { io, Socket } from 'socket.io-client';
import { showToast } from "@/components/ui/toast-provider"

export interface RealtimeNotification {
  id: string
  type: 'order_update' | 'driver_assigned' | 'driver_accepted' | 'order_accepted' | 'ready_for_pickup' | 'order_ready'
  title: string
  message: string
  orderId: string
  timestamp: string
  data?: any
}

class RealtimeService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<(notification: RealtimeNotification) => void>> = new Map();

  connect(token?: string) {
    if (this.socket && this.isConnected) {
      return;
    }

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    
    try {
      this.socket = io(baseApiUrl, {
        transports: ['websocket', 'polling'],
        auth: {
          token: token
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 20000
      });

      this.socket.on('connect', () => {
        console.log('Connected to realtime service');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from realtime service:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
        }
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('Failed to connect to realtime service:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinVendorRoom(vendorId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_vendor_room', { vendor_id: vendorId });
    }
  }

  joinDriverRoom(driverId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_driver_room', { driver_id: driverId });
    }
  }

  joinCustomerRoom(customerId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_customer_room', { customer_id: customerId });
    }
  }

  onOrderUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order_status_updated', callback);
    }
  }

  onDriverAssigned(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('driver_assigned', callback);
    }
  }

  onOrderAccepted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order_accepted', callback);
    }
  }

  onReadyForPickup(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('ready_for_pickup', callback);
    }
  }

  onOrderReady(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order_ready', callback);
    }
  }

  onOrderPreparing(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('order_preparing', callback);
    }
  }

  // Legacy functions for backward compatibility
  sendDriverAssignedNotification(orderId: string, driverId: string, driverName: string) {
    console.log(`Driver ${driverName} assigned to order ${orderId}`);
  }

  sendDriverAcceptedNotification(orderId: string, driverName: string) {
    console.log(`Driver ${driverName} accepted order ${orderId}`);
  }

  sendOrderAcceptedNotification(orderId: string, vendorName: string) {
    console.log(`Order ${orderId} accepted by ${vendorName}`);
  }

  sendReadyForPickupNotification(orderId: string, vendorName: string) {
    console.log(`Order ${orderId} ready for pickup at ${vendorName}`);
  }

  isConnectedToService() {
    return this.isConnected;
  }

  private handleNotification(notification: RealtimeNotification & { read?: boolean }) {
    // Show toast notification
    switch (notification.type) {
      case 'order_update':
        showToast('info', notification.message)
        break
      case 'driver_assigned':
        showToast('success', notification.message)
        break
      case 'driver_accepted':
        showToast('success', notification.message)
        break
      case 'order_accepted':
        showToast('success', notification.message)
        break
      case 'ready_for_pickup':
        showToast('warning', notification.message)
        break
      case 'order_ready':
        showToast('success', notification.message)
        break
      default:
        showToast('info', notification.message)
    }

    // Notify listeners
    const listeners = this.listeners.get(notification.type) || new Set()
    listeners.forEach(listener => listener(notification))
  }

  // Public methods
  public subscribe(type: string, callback: (notification: RealtimeNotification) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(callback)

    return () => {
      const listeners = this.listeners.get(type)
      if (listeners) {
        listeners.delete(callback)
      }
    }
  }

  public sendNotification(notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) {
    const fullNotification: RealtimeNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }

    // Send via WebSocket if connected
    if (this.socket && this.socket.connected) {
      this.socket.emit('notification', fullNotification)
    } else {
      console.warn('WebSocket not connected, notification not sent:', fullNotification)
      // Store locally anyway so it's not lost
      this.storeNotification(fullNotification)
    }
    
    // Also handle it locally for immediate feedback
    this.handleNotification(fullNotification)
  }

  private storeNotification(notification: RealtimeNotification) {
    if (typeof window === 'undefined') return; // Skip in SSR context
    
    try {
      // Get existing notifications
      const notifications = this.getStoredNotifications();
      
      // Add new notification with read status
      notifications.unshift({
        ...notification,
        read: false
      });
      
      // Keep only the last 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      
      // Save back to localStorage
      localStorage.setItem('notifications', JSON.stringify(trimmedNotifications));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  public getStoredNotifications(): (RealtimeNotification & { read: boolean })[] {
    if (typeof window === 'undefined') return []; // Return empty array in SSR context
    
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        return JSON.parse(storedNotifications);
      }
    } catch (error) {
      console.error('Failed to retrieve notifications:', error);
    }
    
    return [];
  }

  public markAsRead(notificationId: string) {
    if (typeof window === 'undefined') return; // Skip in SSR context
    
    try {
      const notifications = this.getStoredNotifications();
      
      // Find and mark the notification as read
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      // Save back to localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
  
  public markAllAsRead() {
    if (typeof window === 'undefined') return; // Skip in SSR context
    
    try {
      const notifications = this.getStoredNotifications();
      
      // Mark all notifications as read
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      // Save back to localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }
}

export const realtimeService = new RealtimeService();

// Export individual functions for backward compatibility
export const sendDriverAssignedNotification = realtimeService.sendDriverAssignedNotification.bind(realtimeService);
export const sendDriverAcceptedNotification = realtimeService.sendDriverAcceptedNotification.bind(realtimeService);
export const sendOrderAcceptedNotification = realtimeService.sendOrderAcceptedNotification.bind(realtimeService);
export const sendReadyForPickupNotification = realtimeService.sendReadyForPickupNotification.bind(realtimeService);