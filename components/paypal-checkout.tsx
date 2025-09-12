import React, { useState } from 'react'
import { useCart } from '@/components/cart-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatZAR } from '@/lib/currency'
import { PAYPAL_CONFIG } from '@/lib/paypal-config'
import { ShoppingCart, CreditCard } from 'lucide-react'

interface PayPalButtonProps {
  item: any
  quantity: number
  size?: string
  customerInfo: any
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ item, quantity, size, customerInfo }) => {
  const total = (item.price * quantity).toFixed(2)
  
  return (
    <form action={PAYPAL_CONFIG.getPayPalUrl()} method="post" target="_blank">
      <input type="hidden" name="cmd" value="_xclick" />
      <input type="hidden" name="business" value={PAYPAL_CONFIG.BUSINESS_EMAIL} />
      <input type="hidden" name="item_name" value={`${item.name}${size ? ` - ${size}` : ''}`} />
      <input type="hidden" name="item_number" value={item.id} />
      <input type="hidden" name="amount" value={total} />
      <input type="hidden" name="quantity" value={quantity} />
      <input type="hidden" name="currency_code" value={PAYPAL_CONFIG.CURRENCY} />
      
      {/* Customer Information */}
      <input type="hidden" name="first_name" value={customerInfo.firstName} />
      <input type="hidden" name="last_name" value={customerInfo.lastName} />
      <input type="hidden" name="email" value={customerInfo.email} />
      <input type="hidden" name="address1" value={customerInfo.address} />
      <input type="hidden" name="city" value={customerInfo.city} />
      <input type="hidden" name="country" value="ZA" />
      
      {/* Return URLs */}
      <input type="hidden" name="return" value={PAYPAL_CONFIG.getReturnUrl()} />
      <input type="hidden" name="cancel_return" value={PAYPAL_CONFIG.getCancelUrl()} />
      <input type="hidden" name="notify_url" value={PAYPAL_CONFIG.getNotifyUrl()} />
      
      {/* Custom data */}
      <input type="hidden" name="custom" value={JSON.stringify({
        orderId: Date.now(),
        customerInfo,
        items: [{ ...item, quantity, size }]
      })} />
      
      <Button 
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3"
        disabled={!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.address}
      >
        <CreditCard className="mr-2 h-5 w-5" />
        Pay with PayPal - ${total} USD
      </Button>
    </form>
  )
}

export default function PayPalCheckout() {
  const { items, total, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })
  const [sizes, setSizes] = useState<{[key: string]: string}>({})

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSizeChange = (itemId: string, size: string) => {
    setSizes(prev => ({ ...prev, [itemId]: size }))
  }

  const isFormValid = customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.address

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-4">Add some products to continue with checkout.</p>
              <Button onClick={() => window.location.href = '/shop'}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">PayPal Checkout</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                    placeholder="Any special instructions..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: {formatZAR(item.price.toString())}</p>
                        
                        {/* Size Selection for Products that have variants */}
                        {(item.name.toLowerCase().includes('supplement') || item.name.toLowerCase().includes('capsaicin')) && (
                          <div className="mt-2">
                            <Label htmlFor={`size-${item.id}`}>Size</Label>
                            <Select onValueChange={(value) => handleSizeChange(item.id, value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatZAR((item.price * item.quantity).toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span>{formatZAR(total)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ≈ ${(total / 18).toFixed(2)} USD (Estimated)
                    </p>
                  </div>
                  
                  {/* PayPal Payment Buttons */}
                  <div className="space-y-3 mt-6">
                    {items.map((item) => (
                      <PayPalButton
                        key={item.id}
                        item={item}
                        quantity={item.quantity}
                        size={sizes[item.id]}
                        customerInfo={customerInfo}
                      />
                    ))}
                  </div>
                  
                  {!isFormValid && (
                    <p className="text-sm text-red-600 text-center mt-4">
                      Please fill in all required fields before proceeding to payment.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
