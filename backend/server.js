require("dotenv").config(); // Server restarted
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const userRoutes = require("./src/routes/userRoutes");
const sellerRoutes = require("./src/routes/sellerRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check route
app.get("/", (req, res) => {
  const mongoose = require("mongoose");
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  res.json({
    status: "Backend is running",
    database: statusMap[dbStatus] || "Unknown",
    db_uri_present: !!process.env.MONGO_URI,
    timestamp: new Date(),
    message: dbStatus !== 1 ? "Database is not connected. If this persists, check your MongoDB Atlas IP whitelisting." : "Ready to serve requests"
  });
});

const enableRequestLogs = process.env.DEBUG_REQUESTS === "true";

if (enableRequestLogs) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const ms = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    });
    next();
  });
}

// Connect to Database on startup
console.log("🔄 Attempting to connect to MongoDB...");
connectDB()
  .then(() => console.log("✓ Database connected on startup"))
  .catch(err => console.error("✗ Startup DB Error:", err.message));

// Local uploads
if (process.env.STORAGE_DRIVER === "local") {
  app.use("/uploads", express.static("uploads"));
}

// API Routes
// Middleware to ensure DB is connected before processing API requests
app.use("/api", async (req, res, next) => {
  const mongoose = require("mongoose");
  
  // If already connected, proceed
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    // Connect to database and wait
    await connectDB();
    
    // Wait up to 3 seconds for connection to be ready
    let attempts = 0;
    while (mongoose.connection.readyState !== 1 && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection still initializing. Please refresh the page.",
        status: "Connecting"
      });
    }

    next();
  } catch (err) {
    console.error("API Connection Error:", err.message);
    return res.status(503).json({
      message: "Server is initializing. Please refresh the page.",
      error: err.message
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", adminRoutes);

// Add review routes
app.use("/api/reviews", reviewRoutes);

// Error handler
app.use(errorMiddleware);

// Export the app for Vercel
module.exports = app;

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
