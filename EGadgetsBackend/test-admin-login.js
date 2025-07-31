const mongoose = require('mongoose');
const Admin = require('./model/Admin');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testAdminLogin() {
  try {
    console.log('🔍 Testing admin login...');
    
    // Find admin user
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Password (hashed):', admin.password.substring(0, 20) + '...');
    
    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🧪 Password test:');
    console.log('   Test password:', testPassword);
    console.log('   Password match:', isMatch ? '✅ YES' : '❌ NO');
    
    if (!isMatch) {
      console.log('\n🔧 Let\'s recreate the admin user...');
      
      // Delete existing admin
      await Admin.deleteOne({ username: 'admin' });
      
      // Create new admin
      const newAdmin = new Admin({
        username: 'admin',
        email: 'aryanbudathoki4@gmail.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created');
      
      // Test again
      const newAdminTest = await Admin.findOne({ username: 'admin' });
      const newIsMatch = await bcrypt.compare('admin123', newAdminTest.password);
      console.log('   New password test:', newIsMatch ? '✅ YES' : '❌ NO');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testAdminLogin(); 