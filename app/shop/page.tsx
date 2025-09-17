"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Truck, Heart, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from 'next/link'
import { formatZAR } from '@/lib/currency'
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface Product {
  id?: number | string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url: string;
  created_at?: string;
}

// Helper: map to formatZAR
const formatPrice = (price: any): string => formatZAR(Number(price) || 0);

// Helper function to get product ID consistently
const getProductId = (product: Product): string => {
  return (product.id || product._id || Math.random().toString()).toString();
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        // Ensure price is a number for all products
        const processedProducts = data.map((product: any) => ({
          ...product,
          price: Number(product.price) || 0,
          stock_quantity: Number(product.stock_quantity) || 0
        }));
        setProducts(processedProducts);
        // Initialize quantities for each product
        const initialQuantities: { [key: string]: number } = {};
        processedProducts.forEach((product: Product) => {
          const productId = getProductId(product);
          initialQuantities[productId] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  useEffect(() => {
    // derive categories from products
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    setCategories(cats);
    // reset selected category if it's no longer available
    if (selectedCategory !== 'All' && !cats.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [products, selectedCategory]);

  const filteredProducts = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (selectedCategory && selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = (product: Product) => {
    // Use either id or _id, and provide a fallback
    const productId = getProductId(product);
    const quantity = quantities[productId] || 1;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: productId.toString(),
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image_url || "/placeholder.svg",
      })
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600">Quality healthcare products from Cape Pharm</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full md:w-1/2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, descriptions..."
              className="w-full border rounded-lg px-3 py-2 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
            <p className="text-gray-400 mt-2">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={getProductId(product)} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
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
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      In Stock ({product.stock_quantity})
                    </Badge>
                  )}
                  {product.stock_quantity === 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.category && (
                      <Badge variant="secondary" className="ml-2">
                        {product.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateQuantity(getProductId(product), -1)}
                        disabled={quantities[getProductId(product)] <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 font-semibold">{quantities[getProductId(product)] || 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateQuantity(getProductId(product), 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                    <div className="space-y-3">
                      <Link href={`/shop/${getProductId(product)}`} className="text-sm text-blue-600 hover:underline">View details</Link>
                    </div>

                    <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                  >
                    {product.stock_quantity === 0 ? (
                      "Out of Stock"
                    ) : (
                      `Add to Cart - ${formatPrice(Number(product.price) * (quantities[getProductId(product)] || 1))}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">Premium ingredients and rigorous testing</p>
          </div>
          <div className="text-center">
            <Truck className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Quick delivery to your doorstep</p>
          </div>
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customer Care</h3>
            <p className="text-gray-600">Dedicated support for your needs</p>
          </div>
        </div>
      </div>
    </div>
  )
}
