const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const id = '69470238d720964d2f1d16e9';
    const user = await User.findById(id);

    if (!user) {
      console.log('User not found in database');
    } else {
      console.log('User found:');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Is Approved:', user.isApproved);
      console.log('Has Password:', !!user.password);
      console.log('Password Length:', user.password ? user.password.length : 0);
      console.log('Business Name:', user.businessName);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();
