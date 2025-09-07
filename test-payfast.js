#!/usr/bin/env node

// PayFast Integration Test Script
// Run: node test-payfast.js

const API_BASE_URL = 'https://capsaicin-backend.onrender.com';

async function testPayFastIntegration() {
  console.log('🧪 Testing PayFast Integration...\n');

  // Test 1: Backend Health Check
  console.log('1️⃣ Testing Backend Health...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend is healthy:', healthData.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return;
  }

  // Test 2: PayFast Form Preparation
  console.log('\n2️⃣ Testing PayFast Form Preparation...');
  try {
    const paymentData = {
      amount: 199.99,
      item_name: 'Test Order - Capsaicin Products',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };

    const formResponse = await fetch(`${API_BASE_URL}/payment/payfast/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    if (formResponse.ok) {
      const formData = await formResponse.json();
      console.log('✅ PayFast form preparation successful');
      console.log('📝 Merchant ID:', formData.paymentData.merchant_id);
      console.log('💰 Amount:', formData.paymentData.amount);
      console.log('🔗 Payment URL:', formData.paymentUrl);
    } else {
      const error = await formResponse.json();
      console.log('❌ PayFast form preparation failed:', error.error);
    }
  } catch (error) {
    console.log('❌ PayFast form preparation error:', error.message);
  }

  // Test 3: Shipping Calculation
  console.log('\n3️⃣ Testing Shipping Calculation...');
  try {
    const shippingData = {
      subtotal: 450,
      shippingMethod: 'standard'
    };

    const shippingResponse = await fetch(`${API_BASE_URL}/shipping/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shippingData)
    });

    if (shippingResponse.ok) {
      const shipping = await shippingResponse.json();
      console.log('✅ Shipping calculation successful');
      console.log('📦 Shipping cost: R' + shipping.shipping.cost);
      console.log('🚚 Method:', shipping.shipping.name);
      console.log('💵 Total with shipping: R' + shipping.total);
      console.log('🆓 Free shipping eligible:', shipping.freeShippingEligible);
    } else {
      const error = await shippingResponse.json();
      console.log('❌ Shipping calculation failed:', error.error);
    }
  } catch (error) {
    console.log('❌ Shipping calculation error:', error.message);
  }

  // Test 4: Order Creation
  console.log('\n4️⃣ Testing Order Creation...');
  try {
    const orderData = {
      items: [
        { id: '1', name: 'Capsaicin Relief Cream 30ml', price: 19.99, quantity: 2 },
        { id: '2', name: 'Capsaicin Relief Cream 60ml', price: 34.99, quantity: 1 }
      ],
      shipping: { cost: 99.00, method: 'standard', name: 'Standard Delivery' },
      customer: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
    };

    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (orderResponse.ok) {
      const order = await orderResponse.json();
      console.log('✅ Order creation successful');
      console.log('🧾 Order ID:', order.id);
      console.log('💰 Subtotal: R' + order.subtotal);
      console.log('🚚 Shipping: R' + order.shipping.cost);
      console.log('💸 Total: R' + order.total);
    } else {
      const error = await orderResponse.json();
      console.log('❌ Order creation failed:', error.error);
    }
  } catch (error) {
    console.log('❌ Order creation error:', error.message);
  }

  console.log('\n🎉 PayFast Integration Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Visit: https://capsaicin-frontend.vercel.app/shop');
  console.log('2. Add products to cart');
  console.log('3. Go to checkout: https://capsaicin-frontend.vercel.app/checkout');
  console.log('4. Test PayFast payment flow');
  console.log('\n📖 Full testing guide: See PAYFAST-TESTING.md');
}

// Run the test
testPayFastIntegration().catch(console.error);
