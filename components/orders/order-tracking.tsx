'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface OrderStatus {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  vendor: {
    business_name: string;
    address: string;
  };
  driver?: {
    email: string;
  };
}

const statusSteps = [
  { id: 'pending', label: 'Order Placed' },
  { id: 'accepted', label: 'Order Accepted' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready for Pickup' },
  { id: 'picked_up', label: 'Picked Up' },
  { id: 'delivered', label: 'Delivered' },
];

export function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // Initial fetch
    fetchOrder();

    // Subscribe to order updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newOrder = payload.new as OrderStatus;
          setOrder(newOrder);
          toast.success(`Order status updated to: ${newOrder.status}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          vendor:vendor_id(business_name, address),
          driver:driver_id(email)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Order not found</p>
      </Card>
    );
  }

  const currentStepIndex = statusSteps.findIndex((step) => step.id === order.status);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Order Status</h2>
          <p className="text-gray-500">
            Order from {order.vendor.business_name}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && order.updated_at && (
                    <p className="text-xs text-gray-400">
                      Updated at {new Date(order.updated_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {order.driver && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900">Driver Information</h3>
            <p className="mt-1 text-sm text-gray-500">{order.driver.email}</p>
          </div>
        )}
      </div>
    </Card>
  );
} 