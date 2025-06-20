'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrderTrackingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
          <p className="text-gray-600">
            {error.message || 'Failed to load order tracking information.'}
          </p>
          <Button
            onClick={reset}
            variant="outline"
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
} 