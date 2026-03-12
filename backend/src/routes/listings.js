const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const listingsController = require("../controllers/listings");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest, createListingSchema, updateListingSchema } = require("../utils/validation");

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/listings (multipart if photo)
router.post(
  "/",
  authenticateToken,
  requireRole("seller"),
  upload.single("photo"),
  (req, res, next) => {
    // Parse numeric fields from multipart form
    if (req.body.material_id) req.body.material_id = parseInt(req.body.material_id);
    if (req.body.quantity) req.body.quantity = parseFloat(req.body.quantity);
    if (req.body.lat) req.body.lat = parseFloat(req.body.lat);
    if (req.body.lon) req.body.lon = parseFloat(req.body.lon);
    next();
  },
  validateRequest(createListingSchema),
  listingsController.create
);

// GET /api/sellers/:sellerId/listings
router.get("/seller/:sellerId?", authenticateToken, listingsController.getSellerListings);

// PATCH /api/listings/:id
router.patch(
  "/:id",
  authenticateToken,
  requireRole("seller"),
  validateRequest(updateListingSchema),
  listingsController.update
);

module.exports = router;
