"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { formatZAR } from '@/lib/currency';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    
    if (paymentId) {
      // Retrieve order data from localStorage to show what was cancelled
      const storedOrder = localStorage.getItem(`order_${paymentId}`);
      if (storedOrder) {
        const order = JSON.parse(storedOrder);
        setOrderData(order);
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleRetryPayment = () => {
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Cancel Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-lg">
              Your payment was cancelled. No charges have been made to your account.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* What Happened */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>• You cancelled the payment process on the PayFast payment page</p>
              <p>• The payment was not completed and no money was charged</p>
              <p>• Your order has not been processed</p>
              <p>• Your cart items are still saved and ready for checkout</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details (if available) */}
        {orderData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cancelled Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span className="font-mono text-sm">{orderData.paymentId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-semibold">{formatZAR(orderData.total)}</span>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Items in this order:</h4>
                  {orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm py-1">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatZAR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>🛒 <strong>Your Cart:</strong> All items are still in your cart</p>
              <p>💳 <strong>Try Again:</strong> You can retry the payment anytime</p>
              <p>🔄 <strong>Different Method:</strong> Consider using a different payment method</p>
              <p>📞 <strong>Need Help?:</strong> Contact us if you're experiencing issues</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleRetryPayment}
            className="flex items-center gap-2 flex-1 max-w-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Payment
          </Button>
          
          <Button 
            onClick={() => router.push('/shop')} 
            variant="outline"
            className="flex items-center gap-2 flex-1 max-w-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
          
          <Button 
            onClick={() => router.push('/')} 
            variant="ghost"
            className="flex-1 max-w-xs"
          >
            Back to Home
          </Button>
        </div>

        {/* Support Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-600 space-y-1">
              <p>If you're having trouble with payment, please:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Check that your card has sufficient funds</li>
                <li>Verify your card details are correct</li>
                <li>Try a different payment method</li>
                <li>Contact your bank if the issue persists</li>
              </ul>
              <p className="mt-3">For technical support, please contact us at support@capsaicin.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentCancelLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main component with Suspense wrapper
export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<PaymentCancelLoading />}>
      <PaymentCancelContent />
    </Suspense>
  )
}
