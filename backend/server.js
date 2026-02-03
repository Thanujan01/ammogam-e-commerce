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

// Simple request logger to help capture incoming requests during debugging
app.use((req, res, next) => {
  try {
    console.log(`REQ ${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body)}`);
  } catch (e) {
    console.log(`REQ ${req.method} ${req.originalUrl} - body: <unserializable>`);
  }
  next();
});

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to Database
connectDB().catch(err => {
  console.error("Delayed DB Connection Error:", err.message);
});

// Local uploads
if (process.env.STORAGE_DRIVER === "local") {
  app.use("/uploads", express.static("uploads"));
}

// API Routes
// Middleware to ensure DB is connected before processing API requests
app.use("/api", async (req, res, next) => {
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
      // If still not connected after one attempt, wait a bit or return error
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
          message: "Database connection still in progress. Please try again in 10 seconds.", 
          status: "Connecting"
        });
      }
    } catch (err) {
      return res.status(503).json({ 
        message: "Database connection failed", 
        error: err.message,
        suggestion: "Ensure your MongoDB Atlas IP whitelist allows Vercel's dynamic IP addresses (suggested: allow all 0.0.0.0/0 for testing)."
      });
    }
  }
  next();
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
