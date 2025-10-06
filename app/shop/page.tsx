import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, FilterIcon } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'
import { formatZAR } from '@/lib/currency'
import { Suspense } from 'react'
import { ShopFilters } from './shop-filters'

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
            <Card key={product.id || product._id || product.sku || Math.random()} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-gray-100">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
                {product.stock_quantity > 0 && (
                  <Badge className="absolute top-2 right-2 bg-green-600">In Stock ({product.stock_quantity})</Badge>
                )}
                {product.stock_quantity === 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-600">Out of Stock</Badge>
                )}
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-red-600">{formatPrice(product.price)}</span>
                  {product.category && (<Badge variant="secondary" className="ml-2">{product.category}</Badge>)}
                </div>

                <div className="space-y-3">
                  <Link href={`/shop/${product.id || product._id || product.sku}` } className="text-sm text-blue-600 hover:underline">View details</Link>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">{product.stock_quantity === 0 ? 'Out of Stock' : `Add to Cart - ${formatPrice(product.price)}`}</Button>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}
