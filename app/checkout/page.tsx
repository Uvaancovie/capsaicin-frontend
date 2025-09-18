"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/components/cart-provider';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, shippingCost, hasTestProduct, setShipping, selectedShipping } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingOzow, setIsProcessingOzow] = useState(false);

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

  // Auto-select free shipping if cart contains test product — do this in effect to avoid setState-in-render
  useEffect(() => {
    // Only auto-select free shipping when the cart contains the test product
    // and the selected shipping is not already 'free'. This avoids dispatching
    // SET_SHIPPING on every render which caused a maximum update depth loop.
    if (typeof window === 'undefined') return
    try {
      if (hasTestProduct && selectedShipping !== 'free') {
        setShipping('free')
      }
    } catch (e) {
      // ignore
    }
  }, [hasTestProduct, selectedShipping, setShipping])

  const shippingLabel = shippingCost === 0 ? 'Free Shipping' : 'Shipping';
  const grandTotal = (Number(total || 0) + (shippingCost || 0)).toFixed(2);

  

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState(selectedShipping || 'standard');
  const [notes, setNotes] = useState('');

  // Proceed to Ozow: call backend /ozow/initiate and auto-submit to https://pay.ozow.com
  const proceedToOzow = async (orderId: string, amountRands: number, customerString = '') => {
    try {
      setIsProcessingOzow(true);
  // orderId is passed in

      // Open named window early to preserve user gesture
      const payWindowName = 'ozow_window';
      let payWindow = null;
      try {
        payWindow = window.open('', payWindowName);
        if (!payWindow) alert('Popup blocked: please allow popups for this site to complete payment');
      } catch (e) {
        console.warn('Failed to open ozow window early', e);
      }

      let apiBase = '';
      if (typeof window !== 'undefined') {
        apiBase = (process.env.NEXT_PUBLIC_API_URL && String(process.env.NEXT_PUBLIC_API_URL).trim()) || (window.location.hostname === 'localhost' ? `http://${window.location.hostname}:4000` : '');
      } else {
        apiBase = (process.env.NEXT_PUBLIC_API_URL && String(process.env.NEXT_PUBLIC_API_URL).trim()) || '';
      }

      const endpointUrl = apiBase ? `${apiBase.replace(/\/$/, '')}/ozow/initiate` : '/ozow/initiate';
      console.log('Calling Ozow initiate at', endpointUrl);

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amountRands: Number(amountRands), bankRef: orderId, customer: customerString })
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response from /ozow/initiate:', text);
        alert('Unexpected response from payment server. Check backend URL and server logs.');
        setIsProcessingOzow(false);
        return;
      }

      if (!data || !data.action || !data.fields) {
        console.error('Ozow initiate failed', data);
        setIsProcessingOzow(false);
        return;
      }

      // Build and submit form to Ozow
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action || 'https://pay.ozow.com';
      form.target = payWindow ? payWindowName : '_blank';

      for (const [k, v] of Object.entries(data.fields || {})) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = String(v ?? '');
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      form.remove();
      setIsProcessingOzow(false);
    } catch (err) {
      console.error('Error creating Ozow payment', err);
      setIsProcessingOzow(false);
    }
  };

  // Submit checkout: create invoice then initiate Ozow
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerAddress) {
      alert('Please provide your name, email and shipping address');
      return;
    }

    try {
      setIsProcessing(true);

      // Build invoice items
      const invoiceItems = items.map((it: any) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        total: Number((it.price * it.quantity).toFixed(2))
      }));

      const invoicePayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || '',
        customer_address: customerAddress,
        items: invoiceItems,
        subtotal: Number(Number(total || 0).toFixed(2)),
        shipping_cost: Number((shippingCost || 0).toFixed(2)),
        total: Number((Number(total || 0) + (shippingCost || 0)).toFixed(2)),
        shipping_method: shippingMethod,
        notes: notes || ''
      };

      // Create invoice on backend
      const created = await api.createInvoice(invoicePayload);
      if (!created || !created.invoice) {
        throw new Error('Invoice creation failed');
      }

      const invoiceNumber = created.invoice.invoice_number || created.invoice_number || '';
      if (!invoiceNumber) throw new Error('Invoice number missing from response');

      // Store initiation payload in sessionStorage for the processing page to pick up
      try {
        const key = `ozow:init:${invoiceNumber}`;
        const payload = { amount: invoicePayload.total, customer: `${customerName} <${customerEmail}>` };
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(key, JSON.stringify(payload));
        }
      } catch (e) {
        console.warn('Failed to save ozow init payload in sessionStorage', e);
      }

      setIsProcessing(false);
      // Immediately navigate to processing page which will initiate payment and poll status
      router.push(`/order/processing?ref=${encodeURIComponent(invoiceNumber)}`);
    } catch (err: any) {
      console.error('Checkout submit error', err);
      alert(err && err.message ? err.message : 'Checkout failed');
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 border rounded" />
            <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Email address" type="email" className="w-full px-3 py-2 border rounded" />
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-3 py-2 border rounded" />
            <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Shipping address" className="w-full px-3 py-2 border rounded" rows={3} />
            <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="standard">Standard Delivery</option>
              <option value="express">Express Delivery</option>
              <option value="free">Free Pickup</option>
            </select>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Order notes (optional)" className="w-full px-3 py-2 border rounded" rows={2} />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isProcessing || isProcessingOzow} className="bg-blue-600 hover:bg-blue-700">
              {isProcessing ? 'Creating order...' : `Pay with Ozow (R ${grandTotal})`}
            </Button>
            <Button variant="ghost" onClick={() => router.push('/shop')}>Continue Shopping</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
