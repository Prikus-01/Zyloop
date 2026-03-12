const { createPayment, updatePaymentByStripeId } = require("../models/payment");
const { getPaymentsByUser } = require("../models/payment");
const logger = require("../utils/logger");

let stripe;
try {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
} catch (e) {
  logger.verbose("Stripe not configured — payment endpoints will return errors");
}

/**
 * POST /api/payments/create-intent
 */
const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    const { pickup_request_id, amount } = req.validatedData;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
      currency: "inr",
      metadata: { pickup_request_id },
    });

    // Save payment record
    const payment = await createPayment({
      pickup_request_id,
      amount,
      currency: "INR",
      status: "pending",
      stripe_charge_id: paymentIntent.id,
    });

    res.status(201).json({
      payment,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    logger.critical("Create payment intent error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

/**
 * POST /api/payments/webhook — Stripe webhook
 */
const handleWebhook = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.critical("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    // Handle event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        await updatePaymentByStripeId(pi.id, "succeeded");
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        await updatePaymentByStripeId(pi.id, "failed");
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.critical("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

/**
 * GET /api/payments — user's payments
 */
const getPayments = async (req, res) => {
  try {
    const payments = await getPaymentsByUser(req.user.id);
    res.json({ payments });
  } catch (error) {
    logger.critical("Get payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

module.exports = { createPaymentIntent, handleWebhook, getPayments };
