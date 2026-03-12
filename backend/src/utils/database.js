const { Pool } = require("pg");
const logger = require("./logger");

let pool;

/**
 * Initialize database connection pool
 * Supports both DATABASE_URL and individual DB_* env vars
 */
const initializePool = () => {
  if (!pool) {
    const config = process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };

    pool = new Pool({
      ...config,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: {
        rejectUnauthorized: false // For self-signed certs
      }
    });

    pool.on("error", (err) => {
      logger.critical("Unexpected error on idle client", err);
    });
  }
  return pool;
};

/**
 * Connect to the database and test connection
 */
const connectDB = async () => {
  try {
    const dbPool = initializePool();
    const client = await dbPool.connect();
    logger.verbose("Connected to PostgreSQL database");
    client.release();
  } catch (error) {
    logger.critical("Failed to connect to database:", error);
    throw error;
  }
};

/**
 * Execute a database query
 */
const query = async (text, params = []) => {
  const dbPool = initializePool();
  const start = Date.now();

  try {
    const result = await dbPool.query(text, params);
    const duration = Date.now() - start;
    logger.verbose("Executed query", { text: text.substring(0, 80), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.critical("Database query error:", error);
    throw error;
  }
};

/**
 * Get a database client for transactions
 */
const getClient = async () => {
  const dbPool = initializePool();
  return await dbPool.connect();
};

module.exports = {
  connectDB,
  query,
  getClient,
};
