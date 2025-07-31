const mongoose = require('mongoose');
const Credential = require('./model/Credentials');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUser() {
  try {
    console.log('🔍 Checking for user "aryan" in database...');
    
    const user = await Credential.findOne({ username: 'aryan' });
    
    if (user) {
      console.log('✅ User found:');
      console.log('   Username:', user.username);
      console.log('   Email:', user.email);
      console.log('   Created:', user.createdAt);
      console.log('   Verified:', user.isVerified || 'N/A');
    } else {
      console.log('❌ User "aryan" not found in database');
      console.log('💡 This means the user registration was not completed.');
      console.log('   The user needs to verify their email by clicking the verification link.');
    }
    
    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await Credential.find({});
    if (allUsers.length === 0) {
      console.log('   No users found in database');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - Created: ${user.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkUser(); 