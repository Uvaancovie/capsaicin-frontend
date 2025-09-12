"use client";

import { useState } from 'react';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, shippingCost, hasTestProduct, setShipping } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  // Auto-select free shipping if cart contains test product
  if (typeof window !== 'undefined' && hasTestProduct && hasTestProduct()) {
    // ensure shipping is set to 'free' in cart state
    try { setShipping('free') } catch (e) { /* ignore in SSR */ }
  }

  const shippingLabel = shippingCost === 0 ? 'Free Shipping' : 'Shipping';
  const grandTotal = (Number(total || 0) + (shippingCost || 0)).toFixed(2);

  // Proceed to PayGate: call backend /paygate/create and open PayGate page
  const proceedToPaygate = async () => {
    try {
      setIsProcessing(true);
      const orderId = `INV-${Date.now().toString().slice(-6)}`; // temporary reference

      // Determine API base URL at runtime. Use NEXT_PUBLIC_API_URL when set.
      // In local dev, detect browser hostname and route to backend at port 4000 to avoid hitting Next dev server port (3001).
      let apiBase = '';
      if (typeof window !== 'undefined') {
        apiBase = (process.env.NEXT_PUBLIC_API_URL && String(process.env.NEXT_PUBLIC_API_URL).trim()) || (window.location.hostname === 'localhost' ? `http://${window.location.hostname}:4000` : '');
      } else {
        apiBase = (process.env.NEXT_PUBLIC_API_URL && String(process.env.NEXT_PUBLIC_API_URL).trim()) || '';
      }
      const endpointUrl = apiBase ? `${apiBase.replace(/\/$/, '')}/paygate/create` : '/paygate/create';
      console.log('Calling PayGate create at', endpointUrl);

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amountRands: Number(grandTotal), currency: 'ZAR', description: 'Order payment' })
      });

      // Some hosts may return HTML error pages (Unexpected token '<'). Read as text and attempt JSON parse.
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response from /paygate/create:', text);
        alert('Unexpected response from payment server. Check backend URL and server logs.');
        setIsProcessing(false);
        return;
      }

      if (!data || !data.success) {
        console.error('PayGate create failed', data);
        setIsProcessing(false);
        return;
      }

      // Build and submit form to PayGate in a new tab/window
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.endpoint || 'https://secure.paygate.co.za/paypage';
      form.target = '_blank';

      // Append fields
      for (const [k, v] of Object.entries(data.fields || {})) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      }

      // signature
      const sigField = document.createElement('input');
      sigField.type = 'hidden';
      sigField.name = 'SIGNATURE';
      sigField.value = data.signature || '';
      form.appendChild(sigField);

      document.body.appendChild(form);
      form.submit();
      form.remove();
      setIsProcessing(false);
    } catch (err) {
      console.error('Error creating PayGate payment', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Payment method: PayGate (card)</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between py-2">
              <div>Subtotal</div>
              <div>R {Number(total).toFixed(2)}</div>
            </div>
            <div className="flex justify-between py-2">
              <div>Shipping</div>
              <div>{shippingLabel}</div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4">
              <div>Total</div>
              <div>R {grandTotal}</div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-sm text-gray-600">Shipping: {shippingLabel} — no charge applied.</p>
        </div>

        <div className="flex gap-4">
          <Button onClick={proceedToPaygate} disabled={isProcessing} className="bg-orange-600 hover:bg-orange-700">
            {isProcessing ? 'Processing...' : `Proceed to Pay with PayGate (R ${grandTotal})`}
          </Button>
          <Button variant="ghost" onClick={() => router.push('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
}
