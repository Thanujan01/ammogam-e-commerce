const mongoose = require("mongoose");

let isConnected = false;

module.exports = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("DB Error: MONGO_URI is not defined in environment variables");
    return;
  }

  try {
    // Check if we already have a connection but not yet marked as connected
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default
      socketTimeoutMS: 45000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err.message);
    // Ensure we reset-on-failure
    isConnected = false;
    throw err;
  }
};
