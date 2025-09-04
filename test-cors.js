// Test CORS from Vercel frontend
async function testCORS() {
  const API_URL = 'https://capsaicin-backend.onrender.com';
  
  console.log('Testing CORS from Vercel frontend origin...');
  
  try {
    // Test with explicit headers to simulate browser request
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://capsaicin-frontend.vercel.app'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('CORS headers:');
    console.log('Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Products fetched:', data.length);
    } else {
      console.log('Response not OK:', await response.text());
    }
    
  } catch (error) {
    console.error('CORS test failed:', error);
  }
}

testCORS();
