const mongoose = require("mongoose");

module.exports = async () => {
  if (!process.env.MONGO_URI) {
    console.error("DB Error: MONGO_URI is not defined in environment variables");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err.message);
    // Don't process.exit(1) in serverless, just log the error
  }
};
