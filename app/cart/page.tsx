"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { formatZAR } from "@/lib/currency"

export default function CartPage() {
  const { items, total, finalTotal, shippingCost, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="w-full sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 mt-3 sm:mt-0">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-red-600 font-bold">{formatZAR(item.price)}</p>

                      <div className="mt-3 sm:mt-2 flex items-center sm:justify-start space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0 ml-auto flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-2">
              <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">
                Clear Cart
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatZAR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatZAR(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost > 0 ? formatZAR(shippingCost) : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (15%)</span>
                    <span>Included</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">{formatZAR(finalTotal)}</span>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                <div className="text-xs text-gray-500 text-center">Secure checkout powered by PayFast</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
