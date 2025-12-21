const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

async function listSellers() {
  console.log('Connecting to:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected');

    const sellers = await User.find({ role: 'seller' });
    console.log(`Found ${sellers.length} sellers:`);
    sellers.forEach(s => {
      console.log(`- ID: ${s._id}, Name: ${s.name}, Approved: ${s.isApproved}, Has Password: ${!!s.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listSellers();
