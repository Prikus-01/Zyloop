const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest, createPaymentIntentSchema } = require("../utils/validation");

// POST /api/payments/create-intent
router.post(
  "/create-intent",
  authenticateToken,
  validateRequest(createPaymentIntentSchema),
  paymentsController.createPaymentIntent
);

// POST /api/payments/webhook — Stripe webhook (raw body needed)
router.post("/webhook", express.raw({ type: "application/json" }), paymentsController.handleWebhook);

// GET /api/payments — user's payment history
router.get("/", authenticateToken, paymentsController.getPayments);

module.exports = router;
