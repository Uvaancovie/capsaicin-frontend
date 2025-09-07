"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/components/cart-provider';
import { formatZAR } from '@/lib/currency';
import { PayFastIntegration, generatePaymentId, formatAmountForPayFast, type PayFastData } from '@/lib/payfast';
import { useToast } from '@/hooks/use-toast';

interface PayFastCheckoutProps {
  onPaymentInitiated?: () => void;
}

export function PayFastCheckout({ onPaymentInitiated }: PayFastCheckoutProps) {
  const { items, finalTotal, selectedShipping } = useCart();
  const { toast } = useToast();
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cellNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create PayFast integration instance
      const payfast = new PayFastIntegration({
        merchantId: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '10000100', // Sandbox default
        merchantKey: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || '46f0cd694581a', // Sandbox default
        passphrase: process.env.NEXT_PUBLIC_PAYFAST_PASSPHRASE,
        sandbox: process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === 'true'
      });

      const paymentId = generatePaymentId('CAPSAICIN');
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Create item description
      const itemNames = items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
      const description = `Capsaicin E-commerce Order: ${itemNames}${selectedShipping ? ` | Shipping: ${selectedShipping}` : ''}`;

      const paymentData: Omit<PayFastData, 'merchant_id' | 'merchant_key' | 'signature'> = {
        return_url: `${baseUrl}/payment/success?payment_id=${paymentId}`,
        cancel_url: `${baseUrl}/payment/cancel?payment_id=${paymentId}`,
        notify_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/payfast/notify`,
        
        name_first: customerDetails.firstName,
        name_last: customerDetails.lastName,
        email_address: customerDetails.email,
        cell_number: customerDetails.cellNumber || undefined,
        
        m_payment_id: paymentId,
        amount: formatAmountForPayFast(finalTotal),
        item_name: `Capsaicin Order #${paymentId.split('_')[1]}`,
        item_description: description,
        
        custom_str1: 'Capsaicin E-commerce',
        custom_str2: selectedShipping || 'standard',
        custom_str3: JSON.stringify(items.map(item => ({ id: item.id, quantity: item.quantity }))),
        custom_int1: items.length.toString()
      };

      // Store order in localStorage for tracking
      const orderData = {
        paymentId,
        items,
        total: finalTotal,
        shipping: selectedShipping,
        customer: customerDetails,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(`order_${paymentId}`, JSON.stringify(orderData));

      // Generate PayFast form HTML
      const formHtml = payfast.generatePaymentForm(paymentData);
      
      // Create a new window/tab with the form and auto-submit
      const paymentWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      if (paymentWindow) {
        paymentWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>PayFast Payment</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                text-align: center; 
                background: #f5f5f5;
              }
              .payfast-button {
                background: #1e40af;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
              }
              .loading {
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="loading">
              <h3>Redirecting to PayFast...</h3>
              <p>Please wait while we redirect you to the secure payment page.</p>
            </div>
            ${formHtml}
          </body>
          </html>
        `);
        paymentWindow.document.close();
        
        onPaymentInitiated?.();
        
        toast({
          title: "Payment Initiated",
          description: "You're being redirected to PayFast for secure payment",
        });
      } else {
        throw new Error('Popup blocked - please allow popups for this site');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Your cart is empty</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Add some items to your cart to continue with checkout.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PayFast Checkout</CardTitle>
        <CardDescription>
          Secure payment with PayFast - South Africa's leading payment gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold mb-3">Order Summary</h4>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatZAR(item.price * item.quantity)}</span>
            </div>
          ))}
          {selectedShipping && (
            <div className="flex justify-between text-sm mb-2 border-t pt-2">
              <span>Shipping ({selectedShipping})</span>
              <span>{formatZAR(finalTotal - items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>{formatZAR(finalTotal)}</span>
          </div>
        </div>

        {/* Customer Details Form */}
        <div className="space-y-4">
          <h4 className="font-semibold">Customer Details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={customerDetails.firstName}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={customerDetails.lastName}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={customerDetails.email}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cellNumber">Cell Number (Optional)</Label>
            <Input
              id="cellNumber"
              type="tel"
              value={customerDetails.cellNumber}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, cellNumber: e.target.value }))}
              placeholder="0821234567"
            />
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>Pay {formatZAR(finalTotal)} with PayFast</>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center">
          <p>🔒 Secure payment powered by PayFast</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </CardContent>
    </Card>
  );
}
