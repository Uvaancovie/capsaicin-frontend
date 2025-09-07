"use client";

import { InvoiceCheckout } from '@/components/invoice-checkout';
import { ShippingOptions } from '@/components/shipping-options';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, selectedShipping, setShipping, total } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <Button onClick={() => router.push('/shop')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Generate an invoice for your order and submit it to our admin team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Options */}
          <div>
            <ShippingOptions 
              selectedShipping={selectedShipping}
              onShippingChange={setShipping}
              cartTotal={total}
            />
          </div>

          {/* Invoice Checkout */}
          <div>
            <InvoiceCheckout 
              onInvoiceGenerated={() => {
                // Optional: Track invoice generation
                console.log('Invoice generated successfully');
              }}
            />
          </div>
        </div>

        {/* Security & Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure Invoice Generation
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Admin Dashboard Integration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
