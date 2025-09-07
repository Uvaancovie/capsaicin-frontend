"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Receipt } from 'lucide-react';
import { formatZAR } from '@/lib/currency';
import { useCart } from '@/components/cart-provider';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    
    if (paymentId) {
      // Retrieve order data from localStorage
      const storedOrder = localStorage.getItem(`order_${paymentId}`);
      if (storedOrder) {
        const order = JSON.parse(storedOrder);
        setOrderData(order);
        
        // Clear the cart since payment was successful
        clearCart();
        
        // Remove the stored order data
        localStorage.removeItem(`order_${paymentId}`);
      }
    }
    
    setLoading(false);
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Order Not Found</CardTitle>
            <CardDescription>
              We couldn't find your order details. Please contact support if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              Thank you for your order. Your payment has been processed successfully.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="font-mono text-sm">{orderData.paymentId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(orderData.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Total Paid:</span>
                <span className="font-semibold text-green-600">{formatZAR(orderData.total)}</span>
              </div>

              {orderData.shipping && (
                <div className="flex justify-between">
                  <span className="font-medium">Shipping:</span>
                  <span>{orderData.shipping}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {orderData.customer.firstName} {orderData.customer.lastName}</p>
              <p><span className="font-medium">Email:</span> {orderData.customer.email}</p>
              {orderData.customer.cellNumber && (
                <p><span className="font-medium">Cell:</span> {orderData.customer.cellNumber}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items Ordered */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Items Ordered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderData.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatZAR(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">{formatZAR(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>✅ <strong>Payment Confirmed:</strong> Your payment has been successfully processed</p>
              <p>📧 <strong>Confirmation Email:</strong> A confirmation email will be sent to {orderData.customer.email}</p>
              <p>📦 <strong>Order Processing:</strong> Your order is being prepared for shipment</p>
              <p>🚚 <strong>Shipping Updates:</strong> You'll receive tracking information once your order ships</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => router.push('/shop')} 
            variant="outline"
            className="flex-1 max-w-xs"
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={() => router.push('/')} 
            className="flex-1 max-w-xs"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
