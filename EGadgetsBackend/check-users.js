const mongoose = require('mongoose');
const Credential = require('./model/Credentials');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/SonicSummit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUsers() {
  try {
    console.log('Checking all users in database...');
    
    const users = await Credential.find({});
    
    if (users.length === 0) {
      console.log(' No regular users found in database');
    } else {
      console.log(`Found ${users.length} regular user(s):`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. Username: ${user.username}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Role: ${user.role || 'user'}`);
        console.log(`      Verified: ${user.isVerified || 'N/A'}`);
        console.log(`      Created: ${user.createdAt}`);
        console.log(`      ID: ${user._id}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers(); 