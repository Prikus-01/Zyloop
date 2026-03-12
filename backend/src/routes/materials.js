const express = require("express");
const router = express.Router();
const materialsController = require("../controllers/materials");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/materials — list all materials with latest rates
router.get("/", materialsController.listMaterials);

// POST /api/pricing — admin create pricing rate
router.post("/pricing", authenticateToken, requireRole("admin"), materialsController.addPricingRate);

module.exports = router;
