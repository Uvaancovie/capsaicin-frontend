import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, FilterIcon } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'
import { formatZAR } from '@/lib/currency'
import { Suspense } from 'react'
import { ShopFilters } from './shop-filters'
import { ProductCard } from '@/components/product-card'

// Server component to fetch products with ISR (revalidate)
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function formatPrice(price: any): string { return formatZAR(Number(price) || 0); }

async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${apiBase}/products/categories`, {
      next: { revalidate: 300 },
      cache: 'force-cache'
    });
    if (!res.ok) return [];
    const categories = await res.json();
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function ShopPage({ searchParams }: { 
  searchParams?: Promise<{ 
    page?: string;
    category?: string;
    search?: string;
  }>
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page || 1));
  const category = params?.category || '';
  const search = params?.search || '';
  const limit = 24;
  
  // Fetch available categories
  const categories = await getCategories();
  
  // Build query string
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  
  const res = await fetch(`${apiBase}/products?${queryParams.toString()}`, { 
    next: { revalidate: 300 }, // 5 minutes cache
    cache: 'force-cache'
  });
  const json = await res.json();
  const products = Array.isArray(json.items) ? json.items : (json || []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category ? `${category} Products` : 'Our Products'}
          </h1>
          <p className="text-xl text-gray-600">
            {search ? `Search results for "${search}"` : 'Quality healthcare products from Cape Pharm'}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ShopFilters currentCategory={category} currentSearch={search} categories={categories} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id || product._id || product.sku || Math.random()} product={product} />
          ))}
        </div>

      </div>
    </div>
  )
}
