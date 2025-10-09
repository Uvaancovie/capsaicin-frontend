'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatZAR } from '@/lib/currency';

interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url: string;
  created_at?: string;
}

// Helper function to safely get product ID (handles both MongoDB _id and id fields)
const getProductId = (product: Product): string => {
  return product.id || product._id || '';
};

// prices are displayed in ZAR using formatZAR

export function AdminProductManager({ categoryFilter, presetCategory }: { categoryFilter?: string; presetCategory?: string } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    image_url: '',
    imageFile: undefined as File | undefined,
    _newCategory: '' as string,
  });

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts(categoryFilter);
      // Ensure price and stock_quantity are numbers
      const processedProducts = data.map((product: any) => ({
        ...product,
        price: Number(product.price) || 0,
        stock_quantity: Number(product.stock_quantity) || 0
      }));
      setProducts(processedProducts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiBase}/products/categories`);
      if (res.ok) {
        const cats = await res.json();
        setCategories(Array.isArray(cats) ? cats : []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories
      setCategories(['Vitamins', 'Pain Relief', 'Weight Loss', 'Jewellery']);
    }
  };

  // Create a new category (admin)
  const createCategory = async (name: string) => {
    if (!name || !name.trim()) return;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiBase}/products/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      if (res.ok) {
        const body = await res.json();
        const merged = Array.isArray(body.categories) ? body.categories : (Array.isArray(body) ? body : []);
        setCategories(merged);
        // Auto-select the newly created category and clear the input
        setFormData({ ...formData, category: name.trim(), _newCategory: '' });
        toast({ title: 'Success', description: `Category "${name.trim()}" created` });
      } else {
        const err = await res.json().catch(() => null);
        toast({ title: 'Error', description: err && err.message ? err.message : 'Failed to create category', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      toast({ title: 'Error', description: 'Failed to create category', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryFilter]);

  const openAddForm = (preset?: string) => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: preset || (presetCategory || ''),
      image_url: '',
      imageFile: undefined,
      _newCategory: '',
    });
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation to avoid sending incomplete multipart requests
    if (!formData.name || !formData.name.trim()) {
      toast({ title: 'Validation', description: 'Product name is required', variant: 'destructive' });
      return;
    }
    if (!formData.description || !formData.description.trim()) {
      toast({ title: 'Validation', description: 'Product description is required', variant: 'destructive' });
      return;
    }
    if (!formData.price || Number.isNaN(Number(formData.price))) {
      toast({ title: 'Validation', description: 'Valid product price is required', variant: 'destructive' });
      return;
    }
    if (!formData.category || !formData.category.trim()) {
      toast({ title: 'Validation', description: 'Product category is required', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category: formData.category,
      };
      // Attach the file if provided
      if (formData.imageFile) productData.imageFile = formData.imageFile;
      else if (formData.image_url) productData.image_url = formData.image_url;

      if (editingProduct) {
        await api.updateProduct(getProductId(editingProduct), productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await api.addProduct(productData);
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: '',
        image_url: '',
        imageFile: undefined,
        _newCategory: '',
      });
      setEditingProduct(null);
      setShowAddForm(false);
      
      // Refresh products
      await fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: editingProduct ? "Failed to update product" : "Failed to add product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: Number(product.price).toString(),
      stock_quantity: product.stock_quantity.toString(),
      category: product.category,
      image_url: product.image_url,
      imageFile: undefined,
      _newCategory: '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Add to deleting set for loading state
    setDeletingIds(prev => new Set([...prev, id]));
    
    // Optimistic update - remove from UI immediately
    const productToDelete = products.find(p => getProductId(p) === id);
    setProducts(prev => prev.filter(p => getProductId(p) !== id));
    
    try {
      await api.deleteProduct(id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      // Product already removed from UI, no need to refetch
    } catch (error) {
      // Revert optimistic update on error
      if (productToDelete) {
        setProducts(prev => [...prev, productToDelete].sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ));
      }
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    } finally {
      // Remove from deleting set
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      image_url: '',
      imageFile: undefined,
      _newCategory: '',
    });
  };

  if (loading && products.length === 0) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => openAddForm()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>
              {editingProduct ? 'Update product information' : 'Enter the details for the new product'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  {presetCategory ? (
                    <>
                      <Input
                        id="category"
                        value={formData.category}
                        readOnly
                        disabled
                      />
                      <div className="text-sm text-gray-500">Category locked to "{presetCategory}"</div>
                    </>
                  ) : (
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Add new category"
                      value={(formData as any)._newCategory || ''}
                      onChange={(e) => setFormData({ ...formData, ...( { _newCategory: e.target.value } as any ) })}
                    />
                    <Button type="button" onClick={() => { const n = (formData as any)._newCategory; if (n) { createCategory(n); setFormData({ ...formData, ...( { _newCategory: '' } as any ) }); } }}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="pt-2">
                  <Label htmlFor="image_file">Or upload image</Label>
                  <input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, imageFile: e.target.files ? e.target.files[0] : undefined })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={getProductId(product)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-green-600">
                    {formatZAR(product.price)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(product)}
                    disabled={deletingIds.has(getProductId(product))}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(getProductId(product))}
                    disabled={deletingIds.has(getProductId(product))}
                    className={deletingIds.has(getProductId(product)) ? 'opacity-50' : ''}
                  >
                    {deletingIds.has(getProductId(product)) ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
