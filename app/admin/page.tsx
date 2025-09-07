"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { formatZAR } from "@/lib/currency"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Eye, Download, Users, FileText, ShoppingCart, TrendingUp } from "lucide-react"
import { AdminProductManager } from "@/components/admin-product-manager"

interface Invoice {
  id?: number | string
  _id?: string
  invoice_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: any[]
  subtotal: string
  shipping_cost: string
  total: string
  status: string
  shipping_method: string
  notes: string
  created_at: string
}

// Helper function to get invoice ID consistently
const getInvoiceId = (invoice: Invoice): string => {
  return (invoice.id || invoice._id || '').toString();
};

export default function AdminDashboard() {
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvoices()
    }
  }, [isAuthenticated])

  useEffect(() => {
    filterInvoices()
  }, [invoices, statusFilter])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await api.adminLogin(credentials.username, credentials.password)
      if (result.success) {
        setIsAuthenticated(true)
        localStorage.setItem('adminToken', result.token)
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        })
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      const data = await api.getInvoices()
      setInvoices(data)
      calculateStats(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive"
      })
    }
  }

  const calculateStats = (invoiceData: Invoice[]) => {
    const totalInvoices = invoiceData.length
    const pendingInvoices = invoiceData.filter(inv => inv.status === 'pending').length
    const totalRevenue = invoiceData.reduce((sum, inv) => sum + parseFloat(inv.total), 0)
    const averageOrderValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

    setStats({
      totalInvoices,
      pendingInvoices,
      totalRevenue,
      averageOrderValue
    })
  }

  const filterInvoices = () => {
    if (statusFilter === 'all') {
      setFilteredInvoices(invoices)
    } else {
      setFilteredInvoices(invoices.filter(inv => inv.status === statusFilter))
    }
  }

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      await api.updateInvoiceStatus(invoiceId, newStatus)
      await fetchInvoices() // Refresh the list
      toast({
        title: "Status updated",
        description: "Invoice status has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive"
      })
    }
  }

  const downloadInvoice = (invoice: Invoice) => {
    const invoiceContent = generateInvoiceHTML(invoice)
    const blob = new Blob([invoiceContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.invoice_number}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateInvoiceHTML = (invoice: Invoice) => {
    const currentDate = new Date().toLocaleDateString('en-ZA')
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoice_number}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { color: #dc2626; font-size: 28px; font-weight: bold; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-info, .invoice-info { flex: 1; }
        .invoice-info { text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .totals { text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">CAPSAICIN RELIEF</div>
        <div>Premium Pain Relief Products</div>
    </div>

    <div class="invoice-details">
        <div class="customer-info">
            <h3>Bill To:</h3>
            <strong>${invoice.customer_name}</strong><br>
            ${invoice.customer_email}<br>
            ${invoice.customer_phone || ''}<br>
            ${invoice.customer_address ? invoice.customer_address.replace(/\n/g, '<br>') : ''}
        </div>
        <div class="invoice-info">
            <h3>Invoice Details:</h3>
            <strong>Invoice #: ${invoice.invoice_number}</strong><br>
            Date: ${currentDate}<br>
            Status: ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}<br>
            Shipping: ${invoice.shipping_method || 'Standard'}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatZAR(item.price)}</td>
                    <td>${formatZAR(item.total)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals">
        <div>Subtotal: ${formatZAR(parseFloat(invoice.subtotal))}</div>
        <div>Shipping: ${formatZAR(parseFloat(invoice.shipping_cost))}</div>
        <div class="total-row">Total: ${formatZAR(parseFloat(invoice.total))}</div>
    </div>

    ${invoice.notes ? `
        <div style="margin-top: 30px;">
            <h4>Notes:</h4>
            <p>${invoice.notes}</p>
        </div>
    ` : ''}

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Contact us: info@capsaicinrelief.com | +27 (0)11 123 4567</p>
        <p>This is a computer-generated invoice.</p>
    </div>
</body>
</html>
    `
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please sign in to access the admin panel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage invoices, orders, and products</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatZAR(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatZAR(stats.averageOrderValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices">Invoices & Orders</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Invoices & Orders</CardTitle>
                    <CardDescription>
                      Manage customer invoices and order requests
                    </CardDescription>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div key={getInvoiceId(invoice)} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{invoice.invoice_number}</h3>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Customer:</strong> {invoice.customer_name} ({invoice.customer_email})
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Total:</strong> {formatZAR(parseFloat(invoice.total))} | 
                            <strong> Items:</strong> {invoice.items.length} | 
                            <strong> Date:</strong> {new Date(invoice.created_at).toLocaleDateString('en-ZA')}
                          </p>
                          {invoice.customer_phone && (
                            <p className="text-sm text-gray-600">
                              <strong>Phone:</strong> {invoice.customer_phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Select
                            value={invoice.status}
                            onValueChange={(newStatus) => updateInvoiceStatus(getInvoiceId(invoice), newStatus)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredInvoices.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No invoices found for the selected filter.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Invoice {selectedInvoice.invoice_number}</CardTitle>
                      <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Customer Details:</h4>
                        <div className="bg-gray-50 p-3 rounded">
                          <p><strong>Name:</strong> {selectedInvoice.customer_name}</p>
                          <p><strong>Email:</strong> {selectedInvoice.customer_email}</p>
                          {selectedInvoice.customer_phone && (
                            <p><strong>Phone:</strong> {selectedInvoice.customer_phone}</p>
                          )}
                          {selectedInvoice.customer_address && (
                            <p><strong>Address:</strong> {selectedInvoice.customer_address}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <div className="space-y-2">
                          {selectedInvoice.items.map((item, index) => (
                            <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatZAR(item.total)}</p>
                                <p className="text-sm text-gray-600">{formatZAR(item.price)} each</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatZAR(parseFloat(selectedInvoice.subtotal))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{formatZAR(parseFloat(selectedInvoice.shipping_cost))}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total:</span>
                          <span>{formatZAR(parseFloat(selectedInvoice.total))}</span>
                        </div>
                      </div>

                      {selectedInvoice.notes && (
                        <div>
                          <h4 className="font-semibold mb-2">Notes:</h4>
                          <div className="bg-gray-50 p-3 rounded">
                            <p>{selectedInvoice.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <AdminProductManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
