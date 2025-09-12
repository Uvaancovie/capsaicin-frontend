"use client";

import { useState } from 'react';
import { InvoiceCheckout } from '@/components/invoice-checkout';
import PayPalCheckout from '@/components/paypal-checkout';
import { ShippingOptions } from '@/components/shipping-options';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, CreditCard } from 'lucide-react';
import PayGateButton from '@/components/PayGateButton';
import { useRouter } from 'next/navigation';

type PaymentMethod = 'invoice' | 'paypal';

export default function CheckoutPage() {
  const { items, selectedShipping, setShipping, total } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

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
          <p className="text-gray-600 mt-2">Choose your preferred payment method</p>
        </div>

        {!paymentMethod ? (
          /* Payment Method Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-orange-500"
              onClick={() => setPaymentMethod('invoice')}
            >
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                <CardTitle>Generate Invoice</CardTitle>
                <CardDescription>
                  Create an invoice and submit to our admin team for manual processing. 
                  We'll contact you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Choose Invoice Method
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => setPaymentMethod('paypal')}
            >
              <CardHeader className="text-center">
                <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>PayPal Payment</CardTitle>
                <CardDescription>
                  Pay instantly with PayPal or credit card. 
                  Secure, fast, and immediate order processing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  Choose PayPal
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => setPaymentMethod(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Payment Method
            </Button>
          </div>
        )}

        {paymentMethod === 'invoice' && (
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
        )}

        {paymentMethod === 'paypal' && (
          <div>
            <PayPalCheckout />
            <div className="mt-6">
              {/* Quick R5 test PayGate button for QA */}
              <PayGateButton orderId="TEST-R5" amountRands={5.00} description="R5 Live Test" />
            </div>
          </div>
        )}

        {/* Security & Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {paymentMethod === 'paypal' ? 'PayPal Secure' : 'Secure Invoice Generation'}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {paymentMethod === 'paypal' ? 'Instant Processing' : 'Admin Dashboard Integration'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
