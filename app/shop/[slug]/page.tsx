import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatZAR } from '@/lib/currency'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductActionsClient from './ProductActionsClient'

type Props = { params: { slug: string } }

export default async function ProductPage({ params }: Props) {
  // Next.js recommends awaiting params before using its properties in async server components
  const { slug } = (await params) as { slug: string }
  // Attempt to fetch product by id/slug. The API exposes getProducts; find locally.
  let product: any = null;
  try {
    const products = await api.getProducts();
    product = products.find((p: any) => (p.id || p._id || String(p.id)) === slug || (p._id === slug) || (`INV-${String(p._id)}` === slug) || (String(p.id) === slug));
  } catch (e) {
    // ignore
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 aspect-square relative">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">No image</div>
                )}
              </div>
              <div>
                <p className="text-lg text-gray-700 mb-4">{product.description}</p>
                <p className="text-3xl font-bold text-red-600 mb-4">{formatZAR(product.price)}</p>
                <div className="mb-4">
                  <span className="font-medium">Category:</span> {product.category || 'General'}
                </div>
                <div className="mb-4">
                  <span className="font-medium">Stock:</span> {product.stock_quantity ?? 0}
                </div>
                <div className="flex gap-4">
                  <ProductActionsClient product={{
                    id: product.id ?? product._id ?? String(product._id ?? product.id),
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url ?? ''
                  }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
