import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Truck, Heart, Zap, Leaf } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-white text-red-600 hover:bg-gray-100">Fast-Acting Heat Therapy</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">Capsaicin Relief</h1>
              <p className="text-xl lg:text-2xl font-medium opacity-90">Fast-Acting Heat Therapy in a Tube</p>
              <p className="text-lg opacity-80 max-w-md">
                Premium chilli seed extract cream for natural joint and muscle pain relief. Targeted heat therapy that
                works where you need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
                  <Link href="/shop">Buy Now - R169.99</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-red-600 hover:bg-red-600 hover:text-white font-semibold"
                >
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
              src="/logo.jpg"
              alt="Capsaicin Relief Cream"
              width={400}
              height={500}
              className="mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Capsaicin Relief?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Fast Relief</h3>
                <p className="text-gray-600">
                  Feel the warming relief within minutes of application. Targeted heat therapy that works quickly.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Leaf className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Natural Ingredients</h3>
                <p className="text-gray-600">
                  Made with premium capsaicin extract and natural anti-inflammatory agents. No harsh chemicals.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Non-Greasy Formula</h3>
                <p className="text-gray-600">
                  Absorbs quickly without leaving residue. Perfect for active lifestyles and daily use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Amazing relief for my arthritis pain. I can feel the warmth working immediately and the pain just
                  melts away. Highly recommend!"
                </p>
                <p className="font-semibold">- Sarah M., Cape Town</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Perfect for post-workout recovery. Non-greasy and works fast. This has become essential in my gym
                  bag."
                </p>
                <p className="font-semibold">- Mike T., Johannesburg</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-red-600" />
              <span className="font-semibold">Money-Back Guarantee</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Truck className="w-6 h-6 text-red-600" />
              <span className="font-semibold">Fast Delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-6 h-6 text-red-600" />
              <span className="font-semibold">Made in South Africa</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-red-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Natural Pain Relief?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers who trust Capsaicin Relief</p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
            <Link href="/shop">Order Now - R169.99</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
