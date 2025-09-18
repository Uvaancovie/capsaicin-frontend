"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderProcessingClient() {
  const search = useSearchParams();
  const ref = search.get('ref') || '';
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [invoice, setInvoice] = useState<any | null>(null);
  const [status, setStatus] = useState<string>('pending');
  const [polling, setPolling] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Try to auto-initiate Ozow if sessionStorage has initiation payload
  useEffect(() => {
    if (!ref) return;
    const key = `ozow:init:${ref}`;
    try {
      const raw = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem(key) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // Fire the initiate call to backend to open Ozow
        (async () => {
          try {
            // call backend to get Ozow form fields
            const apiBase = (process.env.NEXT_PUBLIC_API_URL && String(process.env.NEXT_PUBLIC_API_URL).trim()) || '';
            const endpoint = apiBase ? `${apiBase.replace(/\/$/, '')}/ozow/initiate` : '/ozow/initiate';
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: ref, amountRands: Number(parsed.amount || 0), bankRef: ref, customer: parsed.customer || '' })
            });
            const text = await res.text();
            let data = null;
            try { data = JSON.parse(text); } catch (e) { data = null; }
            if (data && data.action && data.fields) {
              // submit form to Ozow in a new window
              const payWindow = window.open('', 'ozow_window');
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = data.action || 'https://pay.ozow.com';
              form.target = payWindow ? 'ozow_window' : '_blank';
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
            }
          } catch (e) {
            console.warn('Failed to auto-initiate Ozow from processing page', e);
          }
        })();
      }
    } catch (e) {
      // ignore
    }
  }, [ref]);

  // Poll invoice status
  useEffect(() => {
    if (!ref) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const data = await api.getInvoices();
        const found = data.find((inv: any) => inv.invoice_number === ref || inv._id === ref || inv.invoice_number === ref);
        if (found) {
          setInvoice(found);
          setStatus(found.status || 'pending');
          if (String(found.status).toLowerCase() === 'completed') {
            setPolling(false);
            // Clear stored session init
            try { if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.removeItem(`ozow:init:${ref}`); } catch (e) {}
            // Clear cart
            try { clearCart(); } catch (e) {}
          }
        }
      } catch (e: any) {
        setError(e && e.message ? e.message : 'Failed to fetch invoice');
      }
    };

    poll();
    const id = setInterval(() => { if (!cancelled) poll(); }, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, [ref, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Order Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Order reference: <strong>{ref}</strong></p>
            {invoice && (
              <div className="mb-4">
                <p><strong>Status:</strong> {invoice.status}</p>
                <p><strong>Total:</strong> R {Number(invoice.total).toFixed(2)}</p>
                <p><strong>Customer:</strong> {invoice.customer_name} ({invoice.customer_email})</p>
              </div>
            )}

            {error && <p className="text-red-600">{error}</p>}

            {status !== 'completed' ? (
              <div>
                <p className="mb-2">We are waiting for your payment to be confirmed. This page will update automatically.</p>
                <div className="flex gap-2">
                  <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
                  <Button onClick={async () => { try { await api.getInvoice(ref); } catch (e) {} }}>Refresh</Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-green-700 font-semibold mb-4">Payment confirmed — thank you!</p>
                <div className="flex gap-2">
                  <Button onClick={() => router.push('/shop')}>Shop more</Button>
                  <Button onClick={() => router.push(`/invoice/${ref}`)}>View Invoice</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
