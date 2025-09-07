# PayFast Integration Guide

This guide explains how to set up PayFast payment processing for your Capsaicin e-commerce store.

## 🚀 What's Included

✅ **Hosted Checkout (Redirect)** - The fastest and most secure integration  
✅ **ITN Webhook** - Instant Transaction Notifications for order updates  
✅ **PCI Compliance** - PayFast handles all payment security  
✅ **South African Rand** - Native ZAR currency support  
✅ **Signature Verification** - Secure transaction validation  

## 📋 Prerequisites

1. **PayFast Merchant Account** - Sign up at [payfast.co.za](https://www.payfast.co.za)
2. **Merchant ID and Key** - Get these from your PayFast dashboard
3. **Passphrase (Optional)** - For enhanced security

## 🔧 Setup Instructions

### 1. Get PayFast Credentials

**Sandbox (Testing):**
- Merchant ID: `10000100`
- Merchant Key: `46f0cd694581a`
- Use these for testing (already configured)

**Production:**
- Log into your PayFast merchant account
- Go to Settings → Integration
- Copy your Merchant ID and Merchant Key

### 2. Configure Environment Variables

Update your `.env.local` file:

```bash
# PayFast Configuration
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=your_merchant_id
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=your_merchant_key
NEXT_PUBLIC_PAYFAST_PASSPHRASE=your_passphrase_here
NEXT_PUBLIC_PAYFAST_SANDBOX=false  # Set to true for testing
```

### 3. Configure PayFast Dashboard

In your PayFast merchant account, set these URLs:

**Return URL:** `https://your-domain.com/payment/success`  
**Cancel URL:** `https://your-domain.com/payment/cancel`  
**Notify URL:** `https://your-backend.com/payment/payfast/notify`

## 🔄 How It Works

### 1. Customer Checkout Flow

```
1. Customer adds items to cart
2. Goes to /checkout page
3. Fills in customer details
4. Clicks "Pay with PayFast"
5. Redirected to PayFast payment page
6. Completes payment
7. Redirected back to success/cancel page
```

### 2. ITN Webhook Flow

```
1. PayFast processes payment
2. Sends ITN to your webhook endpoint
3. Your backend verifies the signature
4. Updates order status in database
5. Sends confirmation email to customer
```

## 🛡️ Security Features

### Signature Verification

Every payment request includes an MD5 signature to prevent tampering:

```typescript
const signature = generateSignature(paymentData);
// Automatically handled by PayFastIntegration class
```

### Data Validation

- Amount validation (prevents price tampering)
- Order ID verification
- Customer detail validation

## 📱 Integration Code

### Basic Checkout

```tsx
import { PayFastCheckout } from '@/components/payfast-checkout';

export default function CheckoutPage() {
  return (
    <div>
      <PayFastCheckout 
        onPaymentInitiated={() => {
          console.log('Payment started');
        }}
      />
    </div>
  );
}
```

### Manual Payment Form

```typescript
import { PayFastIntegration } from '@/lib/payfast';

const payfast = new PayFastIntegration({
  merchantId: 'your_id',
  merchantKey: 'your_key',
  sandbox: true
});

const paymentUrl = payfast.generatePaymentUrl({
  return_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
  notify_url: 'https://yourapi.com/payfast/notify',
  email_address: 'customer@email.com',
  m_payment_id: 'ORDER_123',
  amount: '199.99',
  item_name: 'Your Product'
});
```

## 🔗 URLs and Endpoints

### Frontend Routes
- `/checkout` - Main checkout page
- `/payment/success` - Payment success page
- `/payment/cancel` - Payment cancelled page

### Backend Endpoints
- `POST /payment/payfast/notify` - ITN webhook
- `POST /payment/payfast/prepare` - Payment preparation
- `POST /orders` - Order creation

## 🧪 Testing

### Test Cards (Sandbox)

**Successful Payment:**
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card: 4000 0000 0000 0010

### Test Process

1. Set `NEXT_PUBLIC_PAYFAST_SANDBOX=true`
2. Use sandbox credentials
3. Test complete checkout flow
4. Verify ITN webhook receives notifications
5. Check order status updates

## 🚢 Production Deployment

### 1. Update Environment Variables

```bash
NEXT_PUBLIC_PAYFAST_SANDBOX=false
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=your_production_id
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=your_production_key
```

### 2. Configure Webhooks

In PayFast dashboard, set:
- **Notify URL:** `https://capsaicin-backend.onrender.com/payment/payfast/notify`
- **Return URL:** `https://capsaicin-frontend.vercel.app/payment/success`
- **Cancel URL:** `https://capsaicin-frontend.vercel.app/payment/cancel`

### 3. SSL Certificate

Ensure your site has a valid SSL certificate (Vercel provides this automatically).

## 📊 Order Management

### ITN Data Structure

```javascript
{
  m_payment_id: 'ORDER_123',
  pf_payment_id: 'payfast_transaction_id',
  payment_status: 'COMPLETE', // COMPLETE, FAILED, PENDING
  amount_gross: '199.99',
  amount_fee: '5.99',
  amount_net: '194.00',
  name_first: 'John',
  name_last: 'Doe',
  email_address: 'john@example.com',
  signature: 'generated_signature'
}
```

### Order Status Updates

- `COMPLETE` - Payment successful, fulfill order
- `FAILED` - Payment failed, notify customer
- `PENDING` - Payment processing, wait for completion

## ❓ Troubleshooting

### Common Issues

**1. Signature Mismatch**
- Check passphrase configuration
- Verify parameter encoding
- Ensure all required fields are included

**2. ITN Not Received**
- Check webhook URL is accessible
- Verify HTTPS is enabled
- Check firewall settings

**3. Payment Redirect Issues**
- Verify return/cancel URLs
- Check for popup blockers
- Ensure URLs are accessible

### Debug Mode

Enable detailed logging:

```javascript
console.log('PayFast payment data:', paymentData);
console.log('Generated signature:', signature);
```

## 📞 Support

- **PayFast Support:** [support@payfast.co.za](mailto:support@payfast.co.za)
- **Documentation:** [developers.payfast.co.za](https://developers.payfast.co.za)
- **Dashboard:** [merchant.payfast.co.za](https://merchant.payfast.co.za)

## 🔐 Security Best Practices

1. **Never expose merchant key** in frontend code
2. **Always verify signatures** on ITN webhooks
3. **Use HTTPS** for all payment pages
4. **Validate amounts** to prevent tampering
5. **Log all transactions** for auditing
6. **Use passphrase** for additional security

---

Your PayFast integration is now ready! Test thoroughly in sandbox mode before going live. 🚀
