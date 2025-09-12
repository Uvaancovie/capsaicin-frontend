// PayPal Configuration
export const PAYPAL_CONFIG = {
  // Replace with your actual PayPal business email
  BUSINESS_EMAIL: 'your-paypal-business@example.com',
  
  // PayPal URLs
  SANDBOX_URL: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
  PRODUCTION_URL: 'https://www.paypal.com/cgi-bin/webscr',
  
  // Environment - change to 'production' when ready to go live
  ENVIRONMENT: 'sandbox' as 'sandbox' | 'production',
  
  // Currency
  CURRENCY: 'USD',
  
  // Return URLs (will be dynamically set based on current domain)
  getReturnUrl: () => `${window.location.origin}/payment/success`,
  getCancelUrl: () => `${window.location.origin}/payment/cancel`,
  getNotifyUrl: () => `${window.location.origin}/api/paypal/ipn`,
  
  // Get the correct PayPal URL based on environment
  getPayPalUrl: () => {
    return PAYPAL_CONFIG.ENVIRONMENT === 'production' 
      ? PAYPAL_CONFIG.PRODUCTION_URL 
      : PAYPAL_CONFIG.SANDBOX_URL;
  }
};

// PayPal Button Configuration for specific products
export const PAYPAL_BUTTONS = {
  // Example: Capsaicin supplement with different sizes
  'capsaicin-supplement': {
    hosted_button_id: 'TXMN4N8Z959KJ', // Your actual button ID from PayPal
    sizes: ['Small', 'Medium', 'Large'],
    prices: {
      'Small': '29.99',
      'Medium': '49.99', 
      'Large': '79.99'
    }
  },
  
  // Add more product configurations as needed
  'capsaicin-cream': {
    hosted_button_id: 'YOUR_BUTTON_ID_HERE',
    sizes: ['30ml', '60ml', '100ml'],
    prices: {
      '30ml': '19.99',
      '60ml': '34.99',
      '100ml': '54.99'
    }
  }
};

// Helper function to get product configuration
export const getPayPalConfig = (productName: string) => {
  const normalizedName = productName.toLowerCase().replace(/\s+/g, '-');
  return PAYPAL_BUTTONS[normalizedName as keyof typeof PAYPAL_BUTTONS];
};
