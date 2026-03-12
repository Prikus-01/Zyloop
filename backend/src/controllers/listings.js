const { createListing, getListingsBySeller, getListingById, updateListing } = require("../models/listing");
const { getMaterialById } = require("../models/material");
const logger = require("../utils/logger");

/**
 * POST /api/listings
 */
const create = async (req, res) => {
  try {
    const { material_id, quantity, unit, notes, pickup_address } = req.validatedData;

    // Get material rate to calculate estimated price
    const material = await getMaterialById(material_id);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    const estimated_price = material.rate_per_unit
      ? parseFloat(material.rate_per_unit) * parseFloat(quantity)
      : null;

    const listing = await createListing({
      seller_id: req.user.id,
      material_id,
      quantity,
      unit: unit || material.unit,
      notes,
      photo_path: req.file ? req.file.path : null,
      estimated_price,
    });

    res.status(201).json({ listing });
  } catch (error) {
    logger.critical("Create listing error:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

/**
 * GET /api/sellers/:sellerId/listings
 */
const getSellerListings = async (req, res) => {
  try {
    const sellerId = req.params.sellerId || req.user.id;
    const listings = await getListingsBySeller(sellerId);
    res.json({ listings });
  } catch (error) {
    logger.critical("Get seller listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

/**
 * PATCH /api/listings/:id
 */
const update = async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.seller_id !== req.user.id) {
      return res.status(403).json({ error: "Not your listing" });
    }

    const updated = await updateListing(req.params.id, req.validatedData);
    res.json({ listing: updated });
  } catch (error) {
    logger.critical("Update listing error:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

module.exports = { create, getSellerListings, update };
