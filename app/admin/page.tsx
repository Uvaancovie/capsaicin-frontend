"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Users, MessageSquare, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  stock: number
  createdAt: string
}

interface Order {
  id: string
  customerName: string
  email: string
  total: number
  status: string
  date: string
  items: Array<{ name: string; quantity: number; price: number }>
}

interface Message {
  id: string
  name: string
  email: string
  message: string
  date: string
  status: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "cr-01",
      name: "Capsaicin Relief Cream",
      price: 169.99,
      description: "Fast-acting chilli seed extract cream for natural joint and muscle pain relief.",
      image: "/placeholder.svg?height=200&width=200",
      stock: 50,
      createdAt: "2024-01-01",
    },
  ])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Smith",
      email: "john@example.com",
      total: 169.99,
      status: "pending",
      date: "2024-01-15",
      items: [{ name: "Capsaicin Relief Cream", quantity: 1, price: 169.99 }],
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      email: "sarah@example.com",
      total: 339.98,
      status: "shipped",
      date: "2024-01-14",
      items: [{ name: "Capsaicin Relief Cream", quantity: 2, price: 169.99 }],
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "MSG-001",
      name: "Mike Wilson",
      email: "mike@example.com",
      message: "I love this product! When will you have more sizes available?",
      date: "2024-01-15",
      status: "unread",
    },
  ])

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const productData = {
      id: editingProduct?.id || `cr-${Date.now()}`,
      name: formData.get("name") as string,
      price: Number.parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      image: "/placeholder.svg?height=200&width=200",
      stock: Number.parseInt(formData.get("stock") as string),
      createdAt: new Date().toISOString(),
    }

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? productData : p)))
      toast({ title: "Product updated successfully!" })
    } else {
      setProducts((prev) => [...prev, productData])
      toast({ title: "Product added successfully!" })
    }

    setEditingProduct(null)
    e.currentTarget.reset()
  }

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast({ title: "Product deleted successfully!" })
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast({ title: `Order ${orderId} status updated to ${newStatus}` })
  }

  const handleMessageStatusUpdate = (messageId: string, newStatus: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === messageId ? { ...message, status: newStatus } : message)),
    )
    toast({ title: `Message marked as ${newStatus}` })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "unread":
        return "bg-red-100 text-red-800"
      case "read":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Capsaicin Relief store</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">
                    R{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-2xl font-bold">{messages.filter((m) => m.status === "unread").length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                  {editingProduct && (
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                      Cancel
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingProduct?.name}
                        required
                        placeholder="Product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (R)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={editingProduct?.price}
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingProduct?.description}
                      required
                      placeholder="Product description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      defaultValue={editingProduct?.stock}
                      required
                      placeholder="0"
                    />
                  </div>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-gray-600">R{product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-gray-600">
                            {order.customerName} - {order.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R{order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOrderStatusUpdate(order.id, "shipped")}
                            disabled={order.status === "shipped"}
                          >
                            Mark Shipped
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOrderStatusUpdate(order.id, "delivered")}
                            disabled={order.status === "delivered"}
                          >
                            Mark Delivered
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{message.name}</h3>
                          <p className="text-gray-600">{message.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                          <p className="text-sm text-gray-500 mt-1">{message.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{message.message}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessageStatusUpdate(message.id, "read")}
                        disabled={message.status === "read"}
                      >
                        Mark as Read
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Store Name</Label>
                      <Input defaultValue="Capsaicin Relief" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input defaultValue="info@capsaicinrelief.co.za" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input placeholder="+27 XX XXX XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input defaultValue="Cape Town, South Africa" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Settings</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Free Shipping Threshold (R)</Label>
                      <Input defaultValue="500" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Standard Shipping Cost (R)</Label>
                      <Input defaultValue="50" type="number" />
                    </div>
                  </div>
                </div>

                <Button className="bg-red-600 hover:bg-red-700">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
