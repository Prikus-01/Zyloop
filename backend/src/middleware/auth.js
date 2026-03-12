const { verifyToken } = require("../utils/jwt");
const { getUserById } = require("../models/user");
const logger = require("../utils/logger");

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.critical("Authentication error:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware to require a specific role
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required role: ${roles.join(" or ")}` });
    }
    next();
  };
};

/**
 * Optional auth — sets req.user if token present, otherwise continues
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = verifyToken(token);
        const user = await getUserById(decoded.userId);
        if (user) req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth,
};
