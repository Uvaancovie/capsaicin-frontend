import React, { Suspense } from 'react'
import { formatZAR } from '@/lib/currency'
import JewelleryLiveWrapper from '@/components/jewellery-live-wrapper'
import { JewelleryFilters } from './jewellery-filters'

async function fetchJewellery(search?: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try {
    const queryParams = new URLSearchParams({
      category: 'Jewellery'
    });
    
    if (search) {
      queryParams.append('search', search);
    }
    
    const res = await fetch(`${API}/products?${queryParams.toString()}`, { 
      next: { revalidate: 300 }, // 5 minutes cache
      cache: 'force-cache'
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.items || [])
  } catch (e) {
    return []
  }
}

export default async function JewelleryPage({ 
  searchParams 
}: { 
  searchParams?: Promise<{ search?: string }>
}) {
  const params = await searchParams;
  const search = params?.search || '';
  const products = await fetchJewellery(search)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {search ? `Jewellery - Search: "${search}"` : 'Jewellery'}
      </h1>
      <p className="mb-6 text-gray-700">Browse our curated jewellery collection. Use the admin panel to add new jewellery items.</p>
      
      {/* Search Section */}
      <div className="mb-8">
        <Suspense fallback={<div>Loading search...</div>}>
          <JewelleryFilters currentSearch={search} />
        </Suspense>
      </div>
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
