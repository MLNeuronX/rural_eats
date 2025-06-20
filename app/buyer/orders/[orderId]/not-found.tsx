import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrderNotFound() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
          <p className="text-gray-600">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-4"
          >
            <Link href="/buyer/orders">
              Back to Orders
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
} 