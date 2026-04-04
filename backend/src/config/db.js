const mongoose = require("mongoose");

let isConnected = false;
let connectionInProgress = false;

const waitForConnection = () => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        if (mongoose.connection.readyState === 1) {
          resolve();
        }
      }, i * 100);
    }
    setTimeout(() => reject(new Error("Connection timeout")), 5000);
  });
};

module.exports = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("DB Error: MONGO_URI is not defined in environment variables");
    throw new Error("MONGO_URI not defined");
  }

  // If connection is already in progress, wait for it
  if (connectionInProgress) {
    try {
      await waitForConnection();
      return;
    } catch (err) {
      throw new Error("Failed to establish database connection");
    }
  }

  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }

    connectionInProgress = true;
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    connectionInProgress = false;
    console.log("✓ MongoDB Connected Successfully");
  } catch (err) {
    console.error("✗ DB Connection Error:", err.message);
    isConnected = false;
    connectionInProgress = false;
    throw err;
  }
};
