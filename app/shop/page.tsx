"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Truck, Heart, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export default function ShopPage() {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const product = {
    id: "cr-01",
    name: "Capsaicin Relief Cream",
    price: 169.99,
    image: "/logo.jpg",
    description: "Fast-acting chilli seed extract cream for natural joint and muscle pain relief.",
    longDescription: `Capsaicin Relief is a premium, locally produced chilli seed extract cream designed to 
    provide fast-acting, natural heat therapy for sore muscles and joints. Formulated with 
    capsaicin and anti-inflammatory agents, this cream delivers targeted pain relief directly 
    to where it's needed — ideal for sports recovery, joint pain, arthritis, or tension relief.`,
    specifications: {
      weight: "30g",
      dimensions: "5 cm x 15 cm x 4 cm",
      manufacturer: "Eden Formulas",
      model: "CR-01",
    },
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.image || "/logo.jpg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80"
                >
                  <Image
                    src={`/placeholder.svg?height=150&width=150`}
                    alt={`${product.name} view ${i + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-red-100 text-red-600 hover:bg-red-200 mb-2">Fast-Acting Relief</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(127 reviews)</span>
              </div>
              <p className="text-4xl font-bold text-red-600 mb-4">
                R{product.price.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal ml-2">Incl. VAT</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={handleAddToCart}
                >
                  Add to Cart - R{(product.price * quantity).toFixed(2)}
                </Button>
                <Button size="lg" variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Heart className="w-5 h-5 text-red-600" />
                <span>Made in South Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight:</dt>
                      <dd className="font-medium">{product.specifications.weight}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions:</dt>
                      <dd className="font-medium">{product.specifications.dimensions}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Model:</dt>
                      <dd className="font-medium">{product.specifications.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Manufacturer:</dt>
                      <dd className="font-medium">{product.specifications.manufacturer}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Key Benefits</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Fast-acting heat therapy</li>
                    <li>• Natural capsaicin extract</li>
                    <li>• Non-greasy formula</li>
                    <li>• Suitable for daily use</li>
                    <li>• Locally manufactured</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
