const { query } = require("../utils/database");

/**
 * Upsert collector location
 */
const upsertLocation = async (collectorId, lat, lon) => {
  const result = await query(
    `INSERT INTO collector_locations (collector_id, lat, lon, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (collector_id) DO UPDATE SET
       lat = $2, lon = $3, updated_at = now()
     RETURNING *`,
    [collectorId, lat, lon]
  );
  return result.rows[0];
};

/**
 * Get collector location
 */
const getLocation = async (collectorId) => {
  const result = await query(
    `SELECT * FROM collector_locations WHERE collector_id = $1`,
    [collectorId]
  );
  return result.rows[0] || null;
};

module.exports = {
  upsertLocation,
  getLocation,
};
