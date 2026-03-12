const express = require("express");
const router = express.Router();
const collectorsController = require("../controllers/collectors");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest, updateLocationSchema } = require("../utils/validation");

// POST /api/collectors/location
router.post(
  "/location",
  authenticateToken,
  requireRole("collector"),
  validateRequest(updateLocationSchema),
  collectorsController.updateLocation
);

module.exports = router;
