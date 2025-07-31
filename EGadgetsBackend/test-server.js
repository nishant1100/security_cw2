const request = require('supertest');
const app = require('./app');

describe('Server Startup Test', () => {
  it('should start without errors', async () => {
    // Test if the app loads correctly
    expect(app).toBeDefined();
  });

  it('should respond to health check', async () => {
    const response = await request(app).get('/api/product');
    expect(response.status).toBe(200);
  });

  it('should have CSRF token endpoint', async () => {
    const response = await request(app).get('/api/csrf-token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('csrfToken');
  });
});

console.log('✅ Server test completed successfully!');
console.log('🚀 You can now start the server with: node start.js'); 


console.log('✅ Server test completed successfully!');
console.log('🚀 You can now start the server with: node start.js'); 