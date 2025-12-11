require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@ammogam.local' });
  if (exists) { console.log('Admin exists'); process.exit(0); }
  const hash = await bcrypt.hash('Admin@123', 10);
  await User.create({ name: 'Admin', email: 'admin@ammogam.local', password: hash, role: 'admin' });
  console.log('Admin created: admin@ammogam.local / Admin@123');
  process.exit(0);
}
run().catch(err=>{console.error(err); process.exit(1);});
