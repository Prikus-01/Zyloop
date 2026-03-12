const { query, getClient } = require("../utils/database");

/**
 * Create a pickup request
 */
const createPickup = async ({ listing_id, seller_id, scheduled_at, pickup_address, lat, lon }) => {
  const result = await query(
    `INSERT INTO pickup_requests (listing_id, seller_id, scheduled_at, status, pickup_address, lat, lon)
     VALUES ($1, $2, $3, 'requested', $4, $5, $6)
     RETURNING *`,
    [listing_id, seller_id, scheduled_at, pickup_address, lat || null, lon || null]
  );
  return result.rows[0];
};

/**
 * Get pickups by seller
 */
const getPickupsBySeller = async (sellerId) => {
  const result = await query(
    `SELECT pr.*, l.quantity, l.unit, l.estimated_price,
            m.name AS material_name, m.slug AS material_slug,
            u.name AS collector_name
     FROM pickup_requests pr
     JOIN listings l ON l.id = pr.listing_id
     JOIN materials m ON m.id = l.material_id
     LEFT JOIN users u ON u.id = pr.assigned_collector_id
     WHERE pr.seller_id = $1
     ORDER BY pr.created_at DESC`,
    [sellerId]
  );
  return result.rows;
};

/**
 * Get pickups assigned to a collector
 */
const getPickupsByCollector = async (collectorId) => {
  const result = await query(
    `SELECT pr.*, l.quantity, l.unit, l.estimated_price,
            m.name AS material_name, m.slug AS material_slug,
            s.name AS seller_name, s.phone AS seller_phone,
            pr.pickup_address
     FROM pickup_requests pr
     JOIN listings l ON l.id = pr.listing_id
     JOIN materials m ON m.id = l.material_id
     JOIN users s ON s.id = pr.seller_id
     WHERE pr.assigned_collector_id = $1
     ORDER BY
       CASE pr.status
         WHEN 'in_progress' THEN 1
         WHEN 'assigned' THEN 2
         WHEN 'completed' THEN 3
         ELSE 4
       END,
       pr.created_at DESC`,
    [collectorId]
  );
  return result.rows;
};

/**
 * Get pickup by ID with details
 */
const getPickupById = async (id) => {
  const result = await query(
    `SELECT pr.*, l.quantity, l.unit, l.estimated_price,
            m.name AS material_name, m.slug AS material_slug,
            u.name AS collector_name, u.phone AS collector_phone,
            s.name AS seller_name, s.phone AS seller_phone
     FROM pickup_requests pr
     JOIN listings l ON l.id = pr.listing_id
     JOIN materials m ON m.id = l.material_id
     LEFT JOIN users u ON u.id = pr.assigned_collector_id
     LEFT JOIN users s ON s.id = pr.seller_id
     WHERE pr.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Get nearby pickups for collectors (approximate distance using lat/lon)
 */
const getNearbyPickups = async (lat, lon, radiusKm = 50) => {
  const result = await query(
    `SELECT * FROM (
       SELECT pr.*, l.quantity, l.unit, l.estimated_price,
              m.name AS material_name, m.slug AS material_slug,
              s.name AS seller_name,
              (6371 * acos(
                LEAST(1, GREATEST(-1,
                  cos(radians($1)) * cos(radians(pr.lat))
                  * cos(radians(pr.lon) - radians($2))
                  + sin(radians($1)) * sin(radians(pr.lat))
                ))
              )) AS distance_km
       FROM pickup_requests pr
       JOIN listings l ON l.id = pr.listing_id
       JOIN materials m ON m.id = l.material_id
       JOIN users s ON s.id = pr.seller_id
       WHERE pr.status = 'requested'
         AND pr.lat IS NOT NULL AND pr.lon IS NOT NULL
     ) sub
     WHERE distance_km < $3
     ORDER BY distance_km
     LIMIT 50`,
    [lat, lon, radiusKm]
  );
  return result.rows;
};

/**
 * Accept a pickup (transactional)
 */
const acceptPickup = async (pickupId, collectorId) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // Check status
    const check = await client.query(
      `SELECT status FROM pickup_requests WHERE id = $1 FOR UPDATE`,
      [pickupId]
    );
    if (!check.rows[0] || check.rows[0].status !== "requested") {
      throw new Error("Pickup is no longer available");
    }

    const result = await client.query(
      `UPDATE pickup_requests
       SET status = 'assigned', assigned_collector_id = $2, accepted_at = now()
       WHERE id = $1
       RETURNING *`,
      [pickupId, collectorId]
    );

    // Log history
    await client.query(
      `INSERT INTO jobs_history (pickup_request_id, old_status, new_status, changed_by)
       VALUES ($1, 'requested', 'assigned', $2)`,
      [pickupId, collectorId]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Start a pickup
 */
const startPickup = async (pickupId, collectorId) => {
  const result = await query(
    `UPDATE pickup_requests
     SET status = 'in_progress'
     WHERE id = $1 AND assigned_collector_id = $2 AND status = 'assigned'
     RETURNING *`,
    [pickupId, collectorId]
  );

  if (result.rows[0]) {
    await query(
      `INSERT INTO jobs_history (pickup_request_id, old_status, new_status, changed_by)
       VALUES ($1, 'assigned', 'in_progress', $2)`,
      [pickupId, collectorId]
    );
  }

  return result.rows[0] || null;
};

/**
 * Complete a pickup
 */
const completePickup = async (pickupId, collectorId, { final_weight, notes }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE pickup_requests
       SET status = 'completed', completed_at = now()
       WHERE id = $1 AND assigned_collector_id = $2 AND status = 'in_progress'
       RETURNING *`,
      [pickupId, collectorId]
    );

    if (!result.rows[0]) {
      throw new Error("Cannot complete this pickup");
    }

    const pickup = result.rows[0];

    // Log history
    await client.query(
      `INSERT INTO jobs_history (pickup_request_id, old_status, new_status, changed_by, note)
       VALUES ($1, 'in_progress', 'completed', $2, $3)`,
      [pickupId, collectorId, notes || null]
    );

    // Update listing status
    await client.query(
      `UPDATE listings SET status = 'collected' WHERE id = $1`,
      [pickup.listing_id]
    );

    // If final_weight provided, update listing quantity
    if (final_weight) {
      await client.query(
        `UPDATE listings SET quantity = $1 WHERE id = $2`,
        [final_weight, pickup.listing_id]
      );
    }

    // Get listing estimated_price for payment amount
    const listingRes = await client.query(
      `SELECT estimated_price, quantity FROM listings WHERE id = $1`,
      [pickup.listing_id]
    );
    const listing = listingRes.rows[0];
    const paymentAmount = final_weight && listing
      ? (parseFloat(listing.estimated_price) / parseFloat(listing.quantity)) * parseFloat(final_weight)
      : parseFloat(listing?.estimated_price || 0);

    // Auto-create payment record
    if (paymentAmount > 0) {
      await client.query(
        `INSERT INTO payments (pickup_request_id, amount, currency, status, paid_to_seller)
         VALUES ($1, $2, 'INR', 'succeeded', true)`,
        [pickupId, paymentAmount.toFixed(2)]
      );
    }

    await client.query("COMMIT");
    return pickup;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get tracking info (pickup status + collector location)
 */
const getTrackingInfo = async (pickupId) => {
  const result = await query(
    `SELECT pr.id, pr.status, pr.scheduled_at, pr.pickup_address,
            pr.assigned_collector_id, pr.accepted_at, pr.completed_at,
            u.name AS collector_name,
            cl.lat AS collector_lat, cl.lon AS collector_lon, cl.updated_at AS location_updated_at
     FROM pickup_requests pr
     LEFT JOIN users u ON u.id = pr.assigned_collector_id
     LEFT JOIN collector_locations cl ON cl.collector_id = pr.assigned_collector_id
     WHERE pr.id = $1`,
    [pickupId]
  );
  return result.rows[0] || null;
};

module.exports = {
  createPickup,
  getPickupsBySeller,
  getPickupsByCollector,
  getPickupById,
  getNearbyPickups,
  acceptPickup,
  startPickup,
  completePickup,
  getTrackingInfo,
};
