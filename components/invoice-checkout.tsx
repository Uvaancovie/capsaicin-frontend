"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { api } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FileText, Mail, Download } from "lucide-react"

interface InvoiceCheckoutProps {
  onInvoiceGenerated?: () => void
}

export function InvoiceCheckout({ onInvoiceGenerated }: InvoiceCheckoutProps) {
  const { items, selectedShipping, total, shippingCost, finalTotal, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  // Get shipping method name from currency.ts
  const getShippingMethodName = (shippingId: string): string => {
    const shippingMap: { [key: string]: string } = {
      'standard': 'Standard Delivery',
      'express': 'Express Delivery', 
      'collection': 'Collection Point',
      'free': 'Free Delivery'
    }
    return shippingMap[shippingId] || 'Standard Delivery'
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateInvoice = async () => {
    if (!customerDetails.name || !customerDetails.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address",
        variant: "destructive"
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before generating an invoice",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const invoiceData = {
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        customer_address: customerDetails.address,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal: total,
        shipping_cost: shippingCost,
        total: finalTotal,
        shipping_method: getShippingMethodName(selectedShipping),
        notes: customerDetails.notes
      }

      const result = await api.createInvoice(invoiceData)
      
      if (result.success) {
        clearCart()
        onInvoiceGenerated?.()
        
        toast({
          title: "Invoice Generated!",
          description: "Your invoice has been created successfully",
        })

        // Redirect to invoice success page
        router.push(`/invoice-success?invoice=${result.invoice.invoice_number}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate invoice",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-red-600" />
          Generate Invoice
        </CardTitle>
        <CardDescription>
          Fill in your details to generate an invoice for your order. You can download the invoice and submit it to our admin for processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Details Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={customerDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={customerDetails.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="address">Shipping Address</Label>
            <Textarea
              id="address"
              value={customerDetails.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your complete shipping address"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={customerDetails.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special instructions or notes (optional)"
              rows={2}
            />
          </div>
        </div>

        {/* Invoice Process Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Generate your invoice with the details above</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Download the invoice for your records</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Submit the invoice to our admin dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>We'll process your order and contact you for payment</span>
            </div>
          </div>
        </div>

        {/* Generate Invoice Button */}
        <Button
          onClick={generateInvoice}
          disabled={loading || !customerDetails.name || !customerDetails.email}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Invoice...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoice
            </>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="pt-4 border-t">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1 text-green-600" />
              Email Confirmation
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1 text-green-600" />
              Instant Download
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure Processing
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
