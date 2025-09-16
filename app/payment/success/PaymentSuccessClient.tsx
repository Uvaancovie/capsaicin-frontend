"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Receipt } from 'lucide-react';
import { formatZAR } from '@/lib/currency';
import { useCart } from '@/components/cart-provider';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<any>(null);
  const [statusInfo, setStatusInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const candidates = ['TransactionReference', 'transactionReference', 'TransactionId', 'reference', 'ref'];
    let ref: string | null = null;
    for (const k of candidates) {
      if (searchParams.get(k)) { ref = searchParams.get(k); break; }
    }

    // Load persisted order if available
    if (paymentId) {
      const storedOrder = localStorage.getItem(`order_${paymentId}`);
      if (storedOrder) {
        const od = JSON.parse(storedOrder);
        setOrderData(od);
        // clear cart
        try { clearCart(); localStorage.removeItem(`order_${paymentId}`); } catch(e) {}
      }
    }

    const fetchStatus = async () => {
      if (!ref) { setLoading(false); return; }
      try {
        setLoading(true);
        const apiBase = (process.env.NEXT_PUBLIC_API_URL && String(process.env.NEXT_PUBLIC_API_URL).trim()) || (window.location.hostname === 'localhost' ? `http://${window.location.hostname}:4000` : '');
        const url = apiBase ? `${apiBase.replace(/\/$/, '')}/ozow/status/by-ref/${encodeURIComponent(ref)}` : `/ozow/status/by-ref/${encodeURIComponent(ref)}`;
        const res = await fetch(url);
        const json = await res.json();
        setStatusInfo(json);
      } catch (e: any) {
        setError(e && e.message ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [searchParams, clearCart, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Received</CardTitle>
            <CardDescription className="text-lg">Thank you — we are finalising your order.</CardDescription>
          </CardHeader>
        </Card>

        {loading && <p className="mb-4">Checking payment status...</p>}
        {error && <p className="text-red-600 mb-4">Error: {error}</p>}

        {statusInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Provider Status</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(statusInfo, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {orderData && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="font-medium">Order ID:</span><span className="font-mono text-sm">{orderData.paymentId}</span></div>
                <div className="flex justify-between"><span className="font-medium">Total Paid:</span><span className="font-semibold text-green-600">{formatZAR(orderData.total)}</span></div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Items</h4>
                  {orderData.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-1"><span>{item.name} × {item.quantity}</span><span>{formatZAR(item.price * item.quantity)}</span></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/shop')} variant="outline" className="flex-1 max-w-xs">Continue Shopping</Button>
          <Button onClick={() => router.push('/')} className="flex-1 max-w-xs">Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
