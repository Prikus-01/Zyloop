const pickupModel = require("../models/pickup");
const { notifyCollectorsInArea } = require("../models/notification");
const logger = require("../utils/logger");

/**
 * POST /api/pickups — create pickup request
 */
const create = async (req, res) => {
  try {
    const { listing_id, scheduled_at, pickup_address, lat, lon } = req.validatedData;

    const pickup = await pickupModel.createPickup({
      listing_id,
      seller_id: req.user.id,
      scheduled_at,
      pickup_address,
      lat,
      lon,
    });

    // Notify collectors in area
    try {
      await notifyCollectorsInArea(
        lat, lon,
        "New pickup request",
        `A new pickup is available at ${pickup_address}`
      );
    } catch (e) {
      logger.verbose("Failed to notify collectors:", e.message);
    }

    res.status(201).json({ pickup });
  } catch (error) {
    logger.critical("Create pickup error:", error);
    res.status(500).json({ error: "Failed to create pickup request" });
  }
};

/**
 * GET /api/pickups/seller — seller's pickups
 */
const getSellerPickups = async (req, res) => {
  try {
    const pickups = await pickupModel.getPickupsBySeller(req.user.id);
    res.json({ pickups });
  } catch (error) {
    logger.critical("Get seller pickups error:", error);
    res.status(500).json({ error: "Failed to fetch pickups" });
  }
};

/**
 * GET /api/pickups/:id/track — tracking info
 */
const trackPickup = async (req, res) => {
  try {
    const tracking = await pickupModel.getTrackingInfo(req.params.id);
    if (!tracking) {
      return res.status(404).json({ error: "Pickup not found" });
    }
    res.json({ tracking });
  } catch (error) {
    logger.critical("Track pickup error:", error);
    res.status(500).json({ error: "Failed to fetch tracking info" });
  }
};

/**
 * GET /api/pickups/nearby — nearby pickups for collectors
 */
const getNearbyPickups = async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }
    const pickups = await pickupModel.getNearbyPickups(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius) || 50
    );
    res.json({ pickups });
  } catch (error) {
    logger.critical("Get nearby pickups error:", error);
    res.status(500).json({ error: "Failed to fetch nearby pickups" });
  }
};

/**
 * POST /api/pickups/:id/accept
 */
const acceptPickup = async (req, res) => {
  try {
    const pickup = await pickupModel.acceptPickup(req.params.id, req.user.id);
    res.json({ pickup });
  } catch (error) {
    logger.critical("Accept pickup error:", error);
    res.status(400).json({ error: error.message || "Failed to accept pickup" });
  }
};

/**
 * POST /api/pickups/:id/start
 */
const startPickup = async (req, res) => {
  try {
    const pickup = await pickupModel.startPickup(req.params.id, req.user.id);
    if (!pickup) {
      return res.status(400).json({ error: "Cannot start this pickup" });
    }
    res.json({ pickup });
  } catch (error) {
    logger.critical("Start pickup error:", error);
    res.status(500).json({ error: "Failed to start pickup" });
  }
};

/**
 * POST /api/pickups/:id/complete
 */
const completePickup = async (req, res) => {
  try {
    const { final_weight, notes } = req.body || {};
    const pickup = await pickupModel.completePickup(req.params.id, req.user.id, {
      final_weight,
      notes,
    });
    res.json({ pickup });
  } catch (error) {
    logger.critical("Complete pickup error:", error);
    res.status(400).json({ error: error.message || "Failed to complete pickup" });
  }
};

/**
 * GET /api/pickups/collector — collector's assigned jobs
 */
const getCollectorJobs = async (req, res) => {
  try {
    const pickups = await pickupModel.getPickupsByCollector(req.user.id);
    res.json({ pickups });
  } catch (error) {
    logger.critical("Get collector jobs error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

module.exports = {
  create,
  getSellerPickups,
  getCollectorJobs,
  trackPickup,
  getNearbyPickups,
  acceptPickup,
  startPickup,
  completePickup,
};
