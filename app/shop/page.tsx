import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Truck, Heart, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'
import { formatZAR } from '@/lib/currency'
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

// Server component to fetch products with ISR (revalidate)
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function formatPrice(price: any): string { return formatZAR(Number(price) || 0); }

export default async function ShopPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Math.max(1, Number(searchParams?.page || 1));
  const limit = 24;
  const res = await fetch(`${apiBase}/products?page=${page}&limit=${limit}`, { next: { revalidate: 60 } });
  const json = await res.json();
  const products = Array.isArray(json.items) ? json.items : (json || []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600">Quality healthcare products from Cape Pharm</p>
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
