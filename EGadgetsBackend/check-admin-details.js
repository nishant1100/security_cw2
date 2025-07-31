const mongoose = require('mongoose');
const Admin = require('./model/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkAdminDetails() {
  try {
    console.log('🔍 Checking admin user details...');
    
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   ID:', admin._id);
    console.log('   Created:', admin.createdAt);
    
    console.log('\n🔑 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email:', admin.email);
    console.log('   URL: http://localhost:5173/admin');
    
    console.log('\n📧 MFA will be sent to:', admin.email);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkAdminDetails(); 