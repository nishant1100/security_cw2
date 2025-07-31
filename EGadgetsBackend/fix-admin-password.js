const mongoose = require('mongoose');
const Admin = require('./model/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixAdminPassword() {
  try {
    console.log(' Fixing admin password...');
    
    // Delete existing admin user
    await Admin.deleteOne({ username: 'admin' });
    console.log(' Deleted existing admin user');
    
    // Create new admin user (this will trigger the pre-save hook)
    const newAdmin = new Admin({
      username: 'admin',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin'
    });
    
    await newAdmin.save();
    console.log(' New admin user created with proper password hashing');
    
    console.log('\n Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:5173/admin');
    
    // Test the password
    console.log('\n Testing password...');
    const testAdmin = await Admin.findOne({ username: 'admin' });
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare('admin123', testAdmin.password);
    
    if (isMatch) {
      console.log(' Password test successful!');
    } else {
      console.log(' Password test failed!');
    }
    
  } catch (error) {
    console.error(' Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

fixAdminPassword(); 