"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from 'next/link'
import { formatZAR } from '@/lib/currency'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  _id?: string
  sku?: string
  name: string
  description: string
  price: number
  stock_quantity: number
  category: string
  image_url: string
}

function formatPrice(price: any): string { return formatZAR(Number(price) || 0); }

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      })
      return
    }

    addItem({
      id: product.id || product._id || '',
      name: product.name,
      price: product.price,
      image: product.image_url
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
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
          <Link href={`/shop/${product.id || product._id || product.sku}`} className="text-sm text-blue-600 hover:underline block">
            View details
          </Link>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : `Add to Cart - ${formatPrice(product.price)}`}
        </Button>
      </CardContent>
    </Card>
  )
}