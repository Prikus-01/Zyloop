const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const authController = require("../controllers/auth");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest, updateProfileSchema } = require("../utils/validation");

// GET /api/users/me
router.get("/me", authenticateToken, authController.getMe);

// GET /api/users/profile
router.get("/profile", authenticateToken, usersController.getUserProfile);

// PUT /api/users/profile
router.put("/profile", authenticateToken, validateRequest(updateProfileSchema), usersController.updateUserProfile);

module.exports = router;
