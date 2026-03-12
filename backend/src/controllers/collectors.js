const { upsertLocation } = require("../models/collectorLocation");
const logger = require("../utils/logger");

/**
 * POST /api/collectors/location
 */
const updateLocation = async (req, res) => {
  try {
    const { lat, lon } = req.validatedData;
    const location = await upsertLocation(req.user.id, lat, lon);
    res.json({ location });
  } catch (error) {
    logger.critical("Update location error:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
};

module.exports = { updateLocation };
