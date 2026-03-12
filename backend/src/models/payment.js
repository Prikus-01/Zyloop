const { query } = require("../utils/database");

/**
 * Create a payment record
 */
const createPayment = async ({ pickup_request_id, amount, currency, status, stripe_charge_id }) => {
  const result = await query(
    `INSERT INTO payments (pickup_request_id, amount, currency, status, stripe_charge_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [pickup_request_id, amount, currency || "INR", status || "pending", stripe_charge_id || null]
  );
  return result.rows[0];
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (id, status, stripe_charge_id) => {
  const result = await query(
    `UPDATE payments SET status = $2, stripe_charge_id = COALESCE($3, stripe_charge_id)
     WHERE id = $1 RETURNING *`,
    [id, status, stripe_charge_id || null]
  );
  return result.rows[0] || null;
};

/**
 * Update payment by stripe charge id
 */
const updatePaymentByStripeId = async (stripe_charge_id, status) => {
  const result = await query(
    `UPDATE payments SET status = $2 WHERE stripe_charge_id = $1 RETURNING *`,
    [stripe_charge_id, status]
  );
  return result.rows[0] || null;
};

/**
 * Get payments for a user (based on pickup seller)
 */
const getPaymentsByUser = async (userId) => {
  const result = await query(
    `SELECT p.*, pr.seller_id, pr.pickup_address,
            l.quantity, l.unit, m.name AS material_name
     FROM payments p
     JOIN pickup_requests pr ON pr.id = p.pickup_request_id
     JOIN listings l ON l.id = pr.listing_id
     JOIN materials m ON m.id = l.material_id
     WHERE pr.seller_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  updatePaymentByStripeId,
  getPaymentsByUser,
};
