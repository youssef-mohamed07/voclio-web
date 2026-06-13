// Quick test script to verify backend connectivity and login
const BACKEND_URL = 'https://voclio-backend.build8.dev/api';
const ADMIN_EMAIL = 'seifashraf12331@gmail.com';
const ADMIN_PASSWORD = 'newpassword1234';

async function testBackend() {
  console.log('🔍 Testing backend connectivity...\n');
  
  // Test 1: Check if backend is reachable
  console.log('1. Testing backend health...');
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    console.log(`   ✅ Backend is reachable (Status: ${healthResponse.status})`);
  } catch (error) {
    console.log(`   ❌ Backend is not reachable: ${error.message}`);
    return;
  }
  
  // Test 2: Try to login
  console.log('\n2. Testing admin login...');
  try {
    const loginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('   ✅ Login successful!');
      console.log('   Full response:', JSON.stringify(data, null, 2));
      
      const token = data.data?.tokens?.access_token || data.token || data.data?.token || data.accessToken;
      if (token) {
        console.log(`   Token: ${token.substring(0, 20)}...`);
      }
      
      // Test 3: Try to fetch users with token
      if (token) {
        console.log('\n3. Testing authenticated API call...');
        const usersResponse = await fetch(`${BACKEND_URL}/admin/users?page=1&limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log(`   ✅ Users API working! Response:`, JSON.stringify(usersData, null, 2).substring(0, 200));
        } else {
          console.log(`   ❌ Users API failed (Status: ${usersResponse.status})`);
          const errorText = await usersResponse.text();
          console.log(`   Error: ${errorText}`);
        }
      }
    } else {
      console.log(`   ❌ Login failed (Status: ${loginResponse.status})`);
      const errorText = await loginResponse.text();
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`   ❌ Login error: ${error.message}`);
  }
  
  console.log('\n✨ Backend test complete!\n');
}

testBackend();
