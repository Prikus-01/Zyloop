const bcrypt = require("bcryptjs");
const { createUser, getUserByEmail } = require("../models/user");
const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const logger = require("../utils/logger");

/**
 * POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.validatedData;

    // Check if user already exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    const user = await createUser({ email, password_hash, name, phone, role });

    const token = generateToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      token,
      refreshToken,
    });
  } catch (error) {
    logger.critical("Signup error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      token,
      refreshToken,
    });
  } catch (error) {
    logger.critical("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * POST /api/auth/refresh
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.validatedData;
    const decoded = verifyRefreshToken(refreshToken);
    const token = generateToken({ userId: decoded.userId, role: decoded.role });

    res.json({ token });
  } catch (error) {
    logger.critical("Refresh error:", error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

/**
 * GET /api/users/me
 */
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { signup, login, refresh, getMe };
