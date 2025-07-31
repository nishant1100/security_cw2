const mongoose = require('mongoose');
const Admin = require('./model/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateAdminEmail() {
  try {
    console.log('🔧 Updating admin email...');
    
    // Find and update admin user
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found! Creating new admin...');
      
      const newAdmin = new Admin({
        username: 'admin',
        email: 'aryanbudathoki44@gmail.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created with updated email');
    } else {
      console.log('✅ Admin user found, updating email...');
      console.log('   Old email:', admin.email);
      
      admin.email = 'aryanbudathoki44@gmail.com';
      await admin.save();
      
      console.log('   New email:', admin.email);
      console.log('✅ Admin email updated successfully');
    }
    
    // Verify the update
    const updatedAdmin = await Admin.findOne({ username: 'admin' });
    console.log('\n🔍 Verification:');
    console.log('   Username:', updatedAdmin.username);
    console.log('   Email:', updatedAdmin.email);
    console.log('   Role:', updatedAdmin.role);
    
    console.log('\n🔑 Updated Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: aryanbudathoki44@gmail.com');
    console.log('   URL: http://localhost:5173/admin');
    
    console.log('\n📧 MFA will be sent to: aryanbudathoki44@gmail.com');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateAdminEmail(); 