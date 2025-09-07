# PayFast Testing Guide for Capsaicin E-commerce

## 🧪 Complete PayFast Testing Instructions

### 1. Environment Setup ✅
Your environment is already configured with PayFast sandbox credentials:
- Merchant ID: `10000100` (PayFast test account)
- Merchant Key: `46f0cd694581a` (PayFast test key)
- Sandbox Mode: `true` (using test environment)

### 2. Test Payment Flow

#### Step 1: Add Products to Cart
1. Visit: https://capsaicin-frontend.vercel.app/shop
2. Add any products to your cart
3. Go to cart page: https://capsaicin-frontend.vercel.app/cart

#### Step 2: Proceed to Checkout
1. Click "Proceed to Checkout" button
2. Fill in customer details (use test data)
3. Select shipping method
4. Click "Pay with PayFast"

#### Step 3: PayFast Sandbox Payment
You'll be redirected to PayFast's test environment where you can:

**✅ Test Successful Payment:**
- Use any test card details
- Complete the payment process
- You'll be redirected back to your success page

**❌ Test Failed Payment:**
- Cancel the payment on PayFast
- You'll be redirected to your cancel page

### 3. Test Scenarios

#### A. Successful Payment Test
```
Test Card: Any 16-digit number (e.g., 4000000000000002)
CVV: Any 3 digits
Expiry: Any future date
Amount: Any amount you add to cart
```

#### B. Failed Payment Test
- Start checkout process
- Click "Cancel" on PayFast page
- Verify redirect to cancel page

#### C. ITN Webhook Test
PayFast will send notifications to your backend:
- Endpoint: `https://capsaicin-backend.onrender.com/payment/payfast/notify`
- Check backend logs for ITN receipt

### 4. Test URLs

| Page | URL |
|------|-----|
| Shop | https://capsaicin-frontend.vercel.app/shop |
| Cart | https://capsaicin-frontend.vercel.app/cart |
| Checkout | https://capsaicin-frontend.vercel.app/checkout |
| Success | https://capsaicin-frontend.vercel.app/payment/success |
| Cancel | https://capsaicin-frontend.vercel.app/payment/cancel |

### 5. Backend API Testing

#### Test PayFast Form Generation:
```bash
curl -X POST https://capsaicin-backend.onrender.com/payment/payfast/prepare \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.00,
    "item_name": "Test Order",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Test Order Creation:
```bash
curl -X POST https://capsaicin-backend.onrender.com/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "1", "name": "Test Product", "price": 100, "quantity": 1}],
    "shipping": {"cost": 50, "method": "standard"},
    "customer": {"email": "test@example.com"}
  }'
```

### 6. What to Look For

#### ✅ Success Indicators:
- Cart calculates totals correctly in ZAR
- Checkout form accepts customer details
- PayFast redirect works
- Payment completion redirects to success page
- Backend receives ITN notifications
- Orders are created with correct amounts

#### ❌ Failure Points to Check:
- CORS errors in browser console
- PayFast signature validation fails
- Backend timeout errors
- Missing environment variables
- Incorrect amount formatting

### 7. Debugging Tools

#### Frontend Console:
- Open browser DevTools (F12)
- Check Console for errors
- Monitor Network tab for API calls

#### Backend Logs:
- Check Render dashboard for backend logs
- Look for PayFast ITN notifications
- Monitor database operations

### 8. Test Data Examples

#### Customer Details:
```
Name: John Doe
Email: test@example.com
Phone: +27123456789
```

#### Test Orders:
```
Product: Capsaicin Relief Cream 30ml (R19.99)
Shipping: Standard Delivery (R99.00)
Total: R118.99
```

### 9. PayFast Sandbox Environment

- **Test URL**: https://sandbox.payfast.co.za/eng/process
- **Live URL**: https://www.payfast.co.za/eng/process (for production)
- **Merchant Dashboard**: https://sandbox.payfast.co.za (login with test account)

### 10. Going Live Checklist

When ready for production:
1. Change `NEXT_PUBLIC_PAYFAST_SANDBOX=false`
2. Update merchant credentials with real PayFast account
3. Set proper passphrase for signature validation
4. Test with small real amounts
5. Monitor ITN webhook delivery

### 🚨 Important Notes

- **Sandbox Mode**: All payments are fake in sandbox
- **No Real Money**: Sandbox transactions don't charge cards
- **ITN Testing**: Webhook notifications work in sandbox
- **SSL Required**: PayFast requires HTTPS for production

### 🆘 Troubleshooting

**Problem**: PayFast redirect fails
**Solution**: Check CORS settings and HTTPS

**Problem**: Payment amount incorrect
**Solution**: Verify ZAR formatting (no currency symbols in amount)

**Problem**: ITN webhook not received
**Solution**: Check backend URL accessibility and logs

**Problem**: Signature validation fails
**Solution**: Verify passphrase and parameter ordering
