const { query } = require("../utils/database");

/**
 * Create a new user
 */
const createUser = async ({ email, password_hash, name, phone, role }) => {
  const result = await query(
    `INSERT INTO users (email, password_hash, name, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, name, phone, role, created_at`,
    [email, password_hash, name, phone || null, role]
  );
  return result.rows[0];
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  const result = await query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Get user by ID (excludes password_hash)
 */
const getUserById = async (id) => {
  const result = await query(
    `SELECT id, email, name, phone, role, stripe_account_id, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Get user by ID WITH password_hash (for auth)
 */
const getUserByIdFull = async (id) => {
  const result = await query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Update user
 */
const updateUser = async (id, fields) => {
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
    `UPDATE users SET ${sets.join(", ")} WHERE id = $${idx}
     RETURNING id, email, name, phone, role, created_at, updated_at`,
    values
  );
  return result.rows[0] || null;
};

/**
 * Get or create user profile
 */
const getProfile = async (userId) => {
  const result = await query(
    `SELECT u.id, u.email, u.name, u.phone, u.role,
            p.address, p.city, p.state, p.pincode, p.lat, p.lon
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};

/**
 * Upsert profile
 */
const upsertProfile = async (userId, { address, city, state, pincode, lat, lon }) => {
  const result = await query(
    `INSERT INTO profiles (user_id, address, city, state, pincode, lat, lon)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE SET
       address = COALESCE($2, profiles.address),
       city = COALESCE($3, profiles.city),
       state = COALESCE($4, profiles.state),
       pincode = COALESCE($5, profiles.pincode),
       lat = COALESCE($6, profiles.lat),
       lon = COALESCE($7, profiles.lon)
     RETURNING *`,
    [userId, address || null, city || null, state || null, pincode || null, lat || null, lon || null]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByIdFull,
  updateUser,
  getProfile,
  upsertProfile,
};
