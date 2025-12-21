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

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

connectDB();

// Local uploads
if (process.env.STORAGE_DRIVER === "local") {
  app.use("/uploads", express.static("uploads"));
}

// API Routes
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

// Error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
