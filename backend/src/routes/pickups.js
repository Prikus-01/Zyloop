const express = require("express");
const router = express.Router();
const pickupsController = require("../controllers/pickups");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest, createPickupSchema, completePickupSchema } = require("../utils/validation");

// POST /api/pickups — create pickup request (seller)
router.post(
  "/",
  authenticateToken,
  requireRole("seller"),
  validateRequest(createPickupSchema),
  pickupsController.create
);

// GET /api/pickups/seller — seller's pickups
router.get("/seller", authenticateToken, requireRole("seller"), pickupsController.getSellerPickups);

// GET /api/pickups/collector — collector's jobs
router.get("/collector", authenticateToken, requireRole("collector"), pickupsController.getCollectorJobs);

// GET /api/pickups/nearby?lat=&lon=&radius= — nearby pickups (collector)
router.get("/nearby", authenticateToken, requireRole("collector"), pickupsController.getNearbyPickups);

// GET /api/pickups/:id/track — tracking info
router.get("/:id/track", authenticateToken, pickupsController.trackPickup);

// POST /api/pickups/:id/accept (collector)
router.post("/:id/accept", authenticateToken, requireRole("collector"), pickupsController.acceptPickup);

// POST /api/pickups/:id/start (collector)
router.post("/:id/start", authenticateToken, requireRole("collector"), pickupsController.startPickup);

// POST /api/pickups/:id/complete (collector)
router.post(
  "/:id/complete",
  authenticateToken,
  requireRole("collector"),
  validateRequest(completePickupSchema),
  pickupsController.completePickup
);

module.exports = router;
