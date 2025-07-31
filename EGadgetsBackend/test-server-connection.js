const axios = require('axios');

async function testServerConnection() {
  try {
    console.log('🔍 Testing server connection...');
    
    // Test basic server response
    const response = await axios.get('http://localhost:3001/api/csrf-token');
    console.log('✅ Server is running on port 3001');
    console.log('   CSRF Token endpoint:', response.status);
    
    // Test admin login
    const loginResponse = await axios.post('http://localhost:3001/api/admin/admin-simple', {
      username: 'admin',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin login test successful');
    console.log('   Status:', loginResponse.status);
    console.log('   Message:', loginResponse.data.message);
    
  } catch (error) {
    console.error('❌ Server test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   Server is not running on port 3001');
      console.error('   Please start the server with: node start.js');
    } else {
      console.error('   Error:', error.response?.data || error.message);
    }
  }
}

testServerConnection(); 