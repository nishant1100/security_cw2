const mongoose = require('mongoose');
const Admin = require('./model/Admin');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testSimpleAdminLogin() {
  try {
    console.log('🔍 Testing simple admin login...');
    
    // Test credentials
    const testUsername = 'admin';
    const testPassword = 'admin123';
    
    // Find admin user
    const admin = await Admin.findOne({ username: testUsername });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('🔧 Creating admin user...');
      
      const newAdmin = new Admin({
        username: testUsername,
        email: 'aryanbudathoki44@gmail.com',
        password: testPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created');
      
      // Test the new admin
      const newAdminTest = await Admin.findOne({ username: testUsername });
      const isMatch = await bcrypt.compare(testPassword, newAdminTest.password);
      console.log('   Password test:', isMatch ? '✅ YES' : '❌ NO');
      
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    
    // Test password
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('\n🧪 Password test:');
    console.log('   Test password:', testPassword);
    console.log('   Password match:', isMatch ? '✅ YES' : '❌ NO');
    
    if (!isMatch) {
      console.log('\n🔧 Password mismatch! Recreating admin...');
      
      // Delete and recreate
      await Admin.deleteOne({ username: testUsername });
      
      const newAdmin = new Admin({
        username: testUsername,
        email: 'aryanbudathoki4@gmail.com',
        password: testPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created');
      
      // Test again
      const newAdminTest = await Admin.findOne({ username: testUsername });
      const newIsMatch = await bcrypt.compare(testPassword, newAdminTest.password);
      console.log('   New password test:', newIsMatch ? '✅ YES' : '❌ NO');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testSimpleAdminLogin(); 