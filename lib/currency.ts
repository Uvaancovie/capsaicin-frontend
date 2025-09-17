// South African Rand (ZAR) currency utilities

export const formatZAR = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return 'R 0.00';
  }
  
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

export const parseZAR = (zarString: string): number => {
  // Remove R symbol, spaces, and commas, then parse
  const cleanString = zarString.replace(/[R\s,]/g, '');
  return parseFloat(cleanString) || 0;
};

// PayFast specific formatting (cents)
export const toPayFastAmount = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  // PayFast expects amounts in cents (multiply by 100)
  return Math.round(numAmount * 100).toString();
};

export const fromPayFastAmount = (cents: string | number): number => {
  const numCents = typeof cents === 'string' ? parseInt(cents) : cents;
  // Convert cents back to rands (divide by 100)
  return numCents / 100;
};

// Shipping calculation utilities
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  trackingAvailable: boolean;
}

export const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Standard courier delivery to your door',
    price: 99.00,
    estimatedDays: '3-5 business days',
    trackingAvailable: true,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Next business day delivery',
    price: 199.00,
    estimatedDays: '1-2 business days',
    trackingAvailable: true,
  },
  {
    id: 'collection',
    name: 'Collection Point',
    description: 'Collect from nearest pickup point',
    price: 59.00,
    estimatedDays: '2-3 business days',
    trackingAvailable: true,
  },
  {
    id: 'free',
    name: 'Free Delivery',
    description: 'Free delivery on orders over R500',
    price: 0.00,
    estimatedDays: '5-7 business days',
    trackingAvailable: false,
  },
];

export const calculateShipping = (cartTotal: number, selectedShipping: string): number => {
  const shipping = shippingOptions.find(option => option.id === selectedShipping);
  
  if (!shipping) {
    return 100.00; // Default to flat R100
  }
  
  // Free shipping on orders over R500
  if (cartTotal >= 500 && selectedShipping === 'free') {
    return 0;
  }
  
  return shipping.price;
};

// PayFast integration helpers
export interface PayFastConfig {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
}

export const generatePayFastData = (
  config: PayFastConfig,
  orderData: {
    amount: number;
    shipping: number;
    item_name: string;
    item_description?: string;
    email_address?: string;
    name_first?: string;
    name_last?: string;
  }
) => {
  const totalAmount = orderData.amount + orderData.shipping;
  
  return {
    // Merchant details
    merchant_id: config.merchant_id,
    merchant_key: config.merchant_key,
    return_url: config.return_url,
    cancel_url: config.cancel_url,
    notify_url: config.notify_url,
    
    // Payment details
    amount: toPayFastAmount(totalAmount),
    item_name: orderData.item_name,
    item_description: orderData.item_description || '',
    
    // Customer details
    email_address: orderData.email_address || '',
    name_first: orderData.name_first || '',
    name_last: orderData.name_last || '',
    
    // Custom fields
    custom_str1: `shipping_${orderData.shipping}`,
    custom_str2: `subtotal_${orderData.amount}`,
  };
};
