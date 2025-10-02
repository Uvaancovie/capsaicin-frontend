"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import { formatZAR } from '@/lib/currency'

export default function JewelleryLive({ initial }: { initial: any[] }) {
  const [products, setProducts] = useState<any[]>(initial || [])
  const { addItem } = useCart()

  useEffect(() => {
    const evtSource = new EventSource((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products/stream')

    evtSource.addEventListener('product_created', (e: any) => {
      try { const data = JSON.parse(e.data); setProducts(prev => [data, ...prev]) } catch (err) {}
    })
    evtSource.addEventListener('product_updated', (e: any) => {
      try { const data = JSON.parse(e.data); setProducts(prev => prev.map(p => (p.id === data.id || p._id === data.id) ? data : p)) } catch (err) {}
    })
    evtSource.addEventListener('product_deleted', (e: any) => {
      try { const data = JSON.parse(e.data); setProducts(prev => prev.filter(p => (p.id || p._id) !== data.id)) } catch (err) {}
    })

    return () => {
      evtSource.close()
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div key={p.id || p._id} className="border rounded p-4">
          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover mb-3 rounded" />}
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-gray-600">{p.description}</p>
          <div className="mt-2 font-bold text-green-600">{formatZAR(p.price)}</div>
          <div className="mt-3 flex gap-2">
            <Link href={`/shop/${p.id || p._id}`} className="inline-block">
              <Button variant="outline">View</Button>
            </Link>
            <Button onClick={() => { addItem({ id: String(p.id || p._id), name: p.name, price: Number(p.price || 0), image: p.image_url || '' }); }}>
              Add to cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
