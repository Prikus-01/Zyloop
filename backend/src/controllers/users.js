const { getProfile, upsertProfile, updateUser } = require("../models/user");
const logger = require("../utils/logger");

/**
 * GET /api/users/profile
 */
const getUserProfile = async (req, res) => {
  try {
    const profile = await getProfile(req.user.id);
    res.json({ profile });
  } catch (error) {
    logger.critical("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * PUT /api/users/profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, lat, lon } = req.validatedData;
    console.log("req.validatedData", req.validatedData);
    // Update user table
    if (name || phone) {
      const userFields = {};
      if (name) userFields.name = name;
      if (phone) userFields.phone = phone;
      await updateUser(req.user.id, userFields);
    }

    // Update profile table
    await upsertProfile(req.user.id, { address, city, state, pincode, lat, lon });

    const profile = await getProfile(req.user.id);
    res.json({ profile });
  } catch (error) {
    logger.critical("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
