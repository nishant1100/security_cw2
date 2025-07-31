const mongoose = require('mongoose');
const Admin = require('./model/Admin');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function resetAdminPassword() {
  try {
    console.log('🔧 Resetting admin password...');
    
    // Find the admin user
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin user created successfully!');
    } else {
      console.log('✅ Found existing admin user. Updating password...');
      
      // Update the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('✅ Admin password updated successfully!');
    }
    
    console.log('\n🔑 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:5173/admin');
    
    // Test the password
    console.log('\n🧪 Testing password...');
    const testAdmin = await Admin.findOne({ username: 'admin' });
    const isMatch = await bcrypt.compare('admin123', testAdmin.password);
    
    if (isMatch) {
      console.log('✅ Password test successful!');
    } else {
      console.log('❌ Password test failed!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

resetAdminPassword(); 