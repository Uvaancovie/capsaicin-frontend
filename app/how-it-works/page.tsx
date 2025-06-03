import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Target, Heart, Clock, Droplets, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-red-100 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How Capsaicin Relief Works</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the science behind natural heat therapy and targeted pain relief
          </p>
          <Image
            src="/placeholder.svg?height=300&width=600"
            alt="How Capsaicin Works"
            width={600}
            height={300}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* The Science */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">The Science Behind Capsaicin</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">Natural Heat Therapy</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Capsaicin, the active compound found in chili peppers, works by temporarily desensitizing pain receptors
                in your skin. When applied topically, it creates a warming sensation that helps block pain signals from
                reaching your brain.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This natural process provides targeted relief exactly where you need it most, without the side effects
                of oral pain medications.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-red-600" />
                  <span className="font-semibold">Activates heat receptors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-red-600" />
                  <span className="font-semibold">Targets pain signals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-red-600" />
                  <span className="font-semibold">Promotes healing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How to Use Capsaicin Relief</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Clean & Dry</h3>
                <p className="text-gray-600">
                  Clean the affected area and ensure skin is completely dry before application.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Apply Thin Layer</h3>
                <p className="text-gray-600">
                  Apply a thin, even layer of cream to the painful area. A little goes a long way.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Massage Gently</h3>
                <p className="text-gray-600">Gently massage until fully absorbed. Wash hands thoroughly after use.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Conditions */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Conditions Does It Help?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Target className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Muscle Pain</h3>
                <p className="text-gray-600">
                  Effective relief for sore, tight, or overworked muscles from exercise or daily activities.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Heart className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Joint Stiffness</h3>
                <p className="text-gray-600">
                  Helps reduce stiffness and improve mobility in joints affected by arthritis or age.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Zap className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Sports Recovery</h3>
                <p className="text-gray-600">
                  Perfect for post-workout recovery and managing sports-related aches and pains.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Chronic Pain</h3>
                <p className="text-gray-600">
                  Provides ongoing relief for chronic pain conditions when used as directed.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Droplets className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Tension Relief</h3>
                <p className="text-gray-600">
                  Helps relieve tension in neck, shoulders, and back from stress or poor posture.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Shield className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Daily Comfort</h3>
                <p className="text-gray-600">
                  Safe for daily use to maintain comfort and mobility in your active lifestyle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-red-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Natural Relief?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands who have discovered the power of capsaicin therapy</p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
            <Link href="/shop">Try Capsaicin Relief Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
