import React from 'react'
import { formatZAR } from '@/lib/currency'
import JewelleryLiveWrapper from '@/components/jewellery-live-wrapper'

async function fetchJewellery() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try {
    const res = await fetch(`${API}/products?category=Jewellery`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.items || [])
  } catch (e) {
    return []
  }
}

export default async function JewelleryPage() {
  const products = await fetchJewellery()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Jewellery</h1>
      <p className="mb-6 text-gray-700">Browse our curated jewellery collection. Use the admin panel to add new jewellery items.</p>
      {products.length === 0 ? (
        <div>No jewellery items found.</div>
      ) : (
        // Client wrapper that subscribes to live updates
        // @ts-ignore Server->Client prop
        <JewelleryLiveWrapper initial={products} />
      )}
    </div>
  )
}
