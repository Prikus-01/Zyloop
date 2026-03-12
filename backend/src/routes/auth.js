const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest, signupSchema, loginSchema, refreshSchema } = require("../utils/validation");

// POST /api/auth/signup
router.post("/signup", validateRequest(signupSchema), authController.signup);

// POST /api/auth/login
router.post("/login", validateRequest(loginSchema), authController.login);

// POST /api/auth/refresh
router.post("/refresh", validateRequest(refreshSchema), authController.refresh);

// GET /api/auth/me (alias for /api/users/me)
router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
