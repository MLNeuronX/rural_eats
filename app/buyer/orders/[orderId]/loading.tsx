import { Card } from '@/components/ui/card';

export default function OrderTrackingLoading() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
} 