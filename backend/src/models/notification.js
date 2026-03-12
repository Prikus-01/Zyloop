const { query } = require("../utils/database");

/**
 * Create notification
 */
const createNotification = async ({ user_id, type, title, body }) => {
  const result = await query(
    `INSERT INTO notifications (user_id, type, title, body)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, type, title, body]
  );
  return result.rows[0];
};

/**
 * Get notifications for a user
 */
const getNotificationsByUser = async (userId, limit = 20) => {
  const result = await query(
    `SELECT * FROM notifications WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

/**
 * Notify collectors in area (creates notification records)
 */
const notifyCollectorsInArea = async (lat, lon, title, body) => {
  // Get collectors who have a location within ~50km
  const result = await query(
    `SELECT DISTINCT u.id
     FROM users u
     LEFT JOIN collector_locations cl ON cl.collector_id = u.id
     WHERE u.role = 'collector'
     LIMIT 50`
  );

  const notifications = [];
  for (const row of result.rows) {
    const notif = await createNotification({
      user_id: row.id,
      type: "new_pickup",
      title,
      body,
    });
    notifications.push(notif);
  }
  return notifications;
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  notifyCollectorsInArea,
};
