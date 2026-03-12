const { getAllMaterials, createPricingRate } = require("../models/material");
const logger = require("../utils/logger");

/**
 * GET /api/materials
 */
const listMaterials = async (req, res) => {
  try {
    const materials = await getAllMaterials();
    res.json({ materials });
  } catch (error) {
    logger.critical("List materials error:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

/**
 * POST /api/pricing (admin only)
 */
const addPricingRate = async (req, res) => {
  try {
    const { material_id, rate_per_unit, effective_from, effective_to, source } = req.body;
    const rate = await createPricingRate({ material_id, rate_per_unit, effective_from, effective_to, source });
    res.status(201).json({ rate });
  } catch (error) {
    logger.critical("Create pricing error:", error);
    res.status(500).json({ error: "Failed to create pricing rate" });
  }
};

module.exports = { listMaterials, addPricingRate };
