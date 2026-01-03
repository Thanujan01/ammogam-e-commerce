require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Connecting to:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 
    });
    console.log('Successfully connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
