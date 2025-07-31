const mongoose = require('mongoose');
const Admin = require('./model/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkAdmins() {
  try {
    console.log(' Checking admin users in database...');
    
    const admins = await Admin.find({});
    
    if (admins.length === 0) {
      console.log(' No admin users found in database');
      console.log('Run "node seed-admin.js" to create an admin user');
    } else {
      console.log(`Found ${admins.length} admin user(s):`);
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. Username: ${admin.username}`);
        console.log(`      Role: ${admin.role}`);
        console.log(`      Created: ${admin.createdAt}`);
        console.log(`      ID: ${admin._id}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkAdmins(); 