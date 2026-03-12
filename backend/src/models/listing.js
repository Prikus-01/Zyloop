const { query } = require("../utils/database");

/**
 * Create a listing (server calculates estimated_price)
 */
const createListing = async ({ seller_id, material_id, quantity, unit, notes, photo_path, estimated_price }) => {
  const result = await query(
    `INSERT INTO listings (seller_id, material_id, quantity, unit, notes, photo_path, estimated_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [seller_id, material_id, quantity, unit || "kg", notes || null, photo_path || null, estimated_price || null]
  );
  return result.rows[0];
};

/**
 * Get listings by seller
 */
const getListingsBySeller = async (sellerId) => {
  const result = await query(
    `SELECT l.*, m.name AS material_name, m.slug AS material_slug
     FROM listings l
     JOIN materials m ON m.id = l.material_id
     WHERE l.seller_id = $1
     ORDER BY l.created_at DESC`,
    [sellerId]
  );
  return result.rows;
};

/**
 * Get listing by ID
 */
const getListingById = async (id) => {
  const result = await query(
    `SELECT l.*, m.name AS material_name, m.slug AS material_slug
     FROM listings l
     JOIN materials m ON m.id = l.material_id
     WHERE l.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Update listing
 */
const updateListing = async (id, fields) => {
  const sets = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    sets.push(`${key} = $${idx}`);
    values.push(value);
    idx++;
  }

  if (sets.length === 0) return null;

  values.push(id);
  const result = await query(
    `UPDATE listings SET ${sets.join(", ")} WHERE id = $${idx}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

module.exports = {
  createListing,
  getListingsBySeller,
  getListingById,
  updateListing,
};
