const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const logger = require("./utils/logger");
const { connectDB } = require("./utils/database");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const materialsRoutes = require("./routes/materials");
const listingsRoutes = require("./routes/listings");
const pickupsRoutes = require("./routes/pickups");
const collectorsRoutes = require("./routes/collectors");
const paymentsRoutes = require("./routes/payments");

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(apiLimiter);

// Body parsing — skip JSON parsing for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next();
  } else {
    express.json({ limit: "10mb" })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/pickups", pickupsRoutes);
app.use("/api/collectors", collectorsRoutes);
app.use("/api/payments", paymentsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.critical("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * Start the server
 */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.verbose(`Recycle Marketplace API running on port ${PORT}`);
      logger.verbose(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.critical("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
