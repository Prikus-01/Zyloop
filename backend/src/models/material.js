const { query } = require("../utils/database");

/**
 * Get all materials with their latest pricing rate
 */
const getAllMaterials = async () => {
  const result = await query(
    `SELECT m.id, m.slug, m.name, m.unit,
            pr.rate_per_unit, pr.effective_from
     FROM materials m
     LEFT JOIN LATERAL (
       SELECT rate_per_unit, effective_from
       FROM pricing_rates
       WHERE material_id = m.id
         AND effective_from <= CURRENT_DATE
         AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
       ORDER BY effective_from DESC
       LIMIT 1
     ) pr ON true
     ORDER BY m.name`
  );
  return result.rows;
};

/**
 * Get material by ID with latest rate
 */
const getMaterialById = async (id) => {
  const result = await query(
    `SELECT m.id, m.slug, m.name, m.unit,
            pr.rate_per_unit, pr.effective_from
     FROM materials m
     LEFT JOIN LATERAL (
       SELECT rate_per_unit, effective_from
       FROM pricing_rates
       WHERE material_id = m.id
         AND effective_from <= CURRENT_DATE
         AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
       ORDER BY effective_from DESC
       LIMIT 1
     ) pr ON true
     WHERE m.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Create a pricing rate
 */
const createPricingRate = async ({ material_id, rate_per_unit, effective_from, effective_to, source }) => {
  const result = await query(
    `INSERT INTO pricing_rates (material_id, rate_per_unit, effective_from, effective_to, source)
     VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5)
     RETURNING *`,
    [material_id, rate_per_unit, effective_from || null, effective_to || null, source || null]
  );
  return result.rows[0];
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createPricingRate,
};
