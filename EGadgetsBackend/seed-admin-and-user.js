// Seed admin and user credentials
const mongoose = require('mongoose');
const Admin = require('./model/Admin');
const Credential = require('./model/Credentials');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/egadgets';

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Seed admin
  const adminExists = await Admin.findOne({ username: 'admin' });
  if (!adminExists) {
    const admin = new Admin({
      username: 'admin',
      email: 'admin@egadgets.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Seeded admin');
  } else {
    console.log('Admin already exists');
  }

  // Seed user
  const userExists = await Credential.findOne({ username: 'user1' });
  if (!userExists) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    const user = new Credential({
      username: 'user1',
      email: 'user1@egadgets.com',
      password: hashedPassword,
      bio: 'Test user'
    });
    await user.save();
    console.log('Seeded user');
  } else {
    console.log('User already exists');
  }

  await mongoose.disconnect();
}

seed();
