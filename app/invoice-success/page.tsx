"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { formatZAR } from "@/lib/currency"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, FileText, Send, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Invoice {
  id: number
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

export default function InvoiceSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const invoiceNumber = searchParams.get('invoice')
  
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (invoiceNumber) {
      fetchInvoice()
    }
  }, [invoiceNumber])

  const fetchInvoice = async () => {
    try {
      // Since we don't have invoice lookup by number, we'll get all invoices and find the right one
      // In production, you'd add a specific endpoint for this
      const invoices = await api.getInvoices()
      const foundInvoice = invoices.find((inv: Invoice) => inv.invoice_number === invoiceNumber)
      
      if (foundInvoice) {
        setInvoice(foundInvoice)
      } else {
        toast({
          title: "Invoice not found",
          description: "The invoice could not be found.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
      toast({
        title: "Error",
        description: "Failed to load invoice details.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = () => {
    if (!invoice) return

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

    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded successfully.",
    })
  }

  const sendToAdmin = async () => {
    if (!invoice) return

    setSending(true)
    try {
      // Convert invoice to order format for admin dashboard
      const orderData = {
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        customer: {
          name: invoice.customer_name,
          email: invoice.customer_email,
          phone: invoice.customer_phone,
          address: invoice.customer_address
        },
        items: invoice.items,
        subtotal: parseFloat(invoice.subtotal),
        shipping_cost: parseFloat(invoice.shipping_cost),
        total: parseFloat(invoice.total),
        shipping_method: invoice.shipping_method,
        notes: invoice.notes,
        status: 'pending_admin_review'
      }

      await api.createOrder(orderData, 'no-token-needed')
      
      toast({
        title: "Sent to Admin",
        description: "Your invoice has been sent to our admin team for processing.",
      })
    } catch (error) {
      console.error('Error sending to admin:', error)
      toast({
        title: "Error",
        description: "Failed to send invoice to admin. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoice details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Invoice not found</h1>
            <p className="mt-2 text-gray-600">The requested invoice could not be found.</p>
            <Button 
              className="mt-6"
              onClick={() => router.push('/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Invoice Generated Successfully!</h1>
          <p className="mt-2 text-gray-600">Your invoice has been created and is ready for download</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Buttons */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  What would you like to do with your invoice?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={downloadInvoice}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                
                <Button 
                  onClick={sendToAdmin}
                  disabled={sending}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {sending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to Admin
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => router.push('/shop')}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice {invoice.invoice_number}
                </CardTitle>
                <CardDescription>
                  Created on {new Date(invoice.created_at).toLocaleDateString('en-ZA')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Customer Details */}
                  <div>
                    <h4 className="font-semibold mb-2">Customer Details:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Name:</strong> {invoice.customer_name}</p>
                      <p><strong>Email:</strong> {invoice.customer_email}</p>
                      {invoice.customer_phone && (
                        <p><strong>Phone:</strong> {invoice.customer_phone}</p>
                      )}
                      {invoice.customer_address && (
                        <p><strong>Address:</strong> {invoice.customer_address}</p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <div className="space-y-2">
                      {invoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
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

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatZAR(parseFloat(invoice.subtotal))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping ({invoice.shipping_method}):</span>
                      <span>{formatZAR(parseFloat(invoice.shipping_cost))}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatZAR(parseFloat(invoice.total))}</span>
                    </div>
                  </div>

                  {invoice.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notes:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{invoice.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Next Steps:</strong> Download your invoice for your records and send it to our admin team. 
                      We'll contact you within 24 hours to arrange payment and delivery.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
