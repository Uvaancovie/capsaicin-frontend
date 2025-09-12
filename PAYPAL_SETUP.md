# PayPal Integration Setup Guide

## 🎯 How to Set Up PayPal for Your Capsaicin E-commerce

### Step 1: PayPal Account Setup

1. **Create/Login to PayPal Business Account**
   - Go to [paypal.com](https://paypal.com)
   - Create a business account if you don't have one
   - Verify your account and add your bank details

2. **Get Your Business Email**
   - This is the email associated with your PayPal business account
   - This is where payments will be received

### Step 2: Configure Your Application

1. **Update PayPal Configuration**
   - Edit `lib/paypal-config.ts`
   - Replace `your-paypal-business@example.com` with your actual PayPal business email

```typescript
// In lib/paypal-config.ts
export const PAYPAL_CONFIG = {
  BUSINESS_EMAIL: 'your-actual-paypal@example.com', // ← Change this
  ENVIRONMENT: 'sandbox', // Change to 'production' when ready
  // ... rest of config
};
```

### Step 3: Create PayPal Buttons (Optional - Advanced)

For more control, you can create hosted buttons in PayPal:

1. **Login to PayPal Business Account**
2. **Go to Merchant Tools** → **PayPal Buttons**
3. **Create New Button** for each product
4. **Configure Button:**
   - Button Type: Buy Now or Add to Cart
   - Item Name: Your product name
   - Item ID: Your product ID
   - Price: Set or leave blank for variable pricing
   - Shipping: Configure as needed

5. **Get Button Code**
   - Copy the `hosted_button_id` from the generated code
   - Update `PAYPAL_BUTTONS` in `lib/paypal-config.ts`

### Step 4: Environment Settings

#### For Testing (Sandbox):
- Keep `ENVIRONMENT: 'sandbox'` in config
- Use PayPal sandbox accounts for testing
- Create test buyer accounts at [developer.paypal.com](https://developer.paypal.com)

#### For Production:
- Change `ENVIRONMENT: 'production'` in config
- Use your real PayPal business account
- Test with small amounts first

### Step 5: Webhook Configuration (Optional)

To receive payment notifications:

1. **In PayPal Account** → **Account Settings** → **Notifications**
2. **Add IPN URL**: `https://your-domain.com/api/paypal/ipn`
3. **Select Events**: Payment completed, Payment failed, etc.

### Step 6: Test the Integration

1. **Local Testing:**
   ```bash
   npm run dev
   # Go to http://localhost:3001/checkout
   # Select PayPal payment method
   # Fill in customer details
   # Click "Pay with PayPal" button
   ```

2. **What Should Happen:**
   - Button redirects to PayPal (sandbox for testing)
   - Customer completes payment
   - Redirects back to your success page
   - Payment appears in your PayPal account

### Step 7: Customize for Your Products

Update the PayPal configuration for your specific Capsaicin products:

```typescript
// In lib/paypal-config.ts
export const PAYPAL_BUTTONS = {
  'capsaicin-supplement': {
    hosted_button_id: 'YOUR_BUTTON_ID', // From PayPal if you created hosted buttons
    sizes: ['Small', 'Medium', 'Large'],
    prices: {
      'Small': '29.99',
      'Medium': '49.99', 
      'Large': '79.99'
    }
  },
  'capsaicin-cream': {
    hosted_button_id: 'YOUR_BUTTON_ID',
    sizes: ['30ml', '60ml', '100ml'],
    prices: {
      '30ml': '19.99',
      '60ml': '34.99',
      '100ml': '54.99'
    }
  }
  // Add more products as needed
};
```

## 🔧 Current Implementation Features

✅ **Dual Payment System**: Invoice + PayPal options
✅ **Customer Information**: Collected before payment
✅ **Product Variants**: Size selection for products
✅ **Responsive Design**: Works on all devices
✅ **Security**: Customer data sent securely to PayPal
✅ **Return Handling**: Success/cancel page redirection

## 🚀 Going Live Checklist

- [ ] PayPal business account verified
- [ ] Business email updated in config
- [ ] Environment changed to 'production'
- [ ] Test transactions completed
- [ ] Return URLs working correctly
- [ ] Customer support process established
- [ ] Order fulfillment process ready

## 💡 Tips for Success

1. **Start with Sandbox**: Always test thoroughly before going live
2. **Small Test Orders**: Make small real purchases when testing production
3. **Clear Pricing**: Ensure your USD prices are clear to customers
4. **Customer Support**: Have a process to handle payment issues
5. **Order Fulfillment**: Set up systems to fulfill orders quickly
6. **Backup Payment**: Keep the invoice system as a backup option

## 🆘 Troubleshooting

**Common Issues:**

1. **Button Not Working**: Check business email in config
2. **Wrong Currency**: Verify currency settings match your account
3. **Redirect Issues**: Ensure return URLs are correct
4. **Payment Not Received**: Check PayPal account settings and email notifications

**Support Resources:**
- PayPal Developer Documentation: https://developer.paypal.com
- PayPal Business Support: https://paypal.com/businesshelp
- Integration Guide: This file!
