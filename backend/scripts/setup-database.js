const { Pool } = require("pg");
require("dotenv").config();

/**
 * Database setup script
 * Creates tables and seeds initial materials + pricing data
 */
const setupDatabase = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.DATABASE_URL
      ? {}
      : {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        }),
    ssl: {
			rejectUnauthorized: false // For self-signed certs
		}
  });

  try {
    console.log("Setting up database...");

    // Read and execute schema file
    const fs = require("fs");
    const path = require("path");

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "../sql/schema.sql"),
      "utf8"
    );
    await pool.query(schemaSQL);
    console.log("Database schema created successfully");

    // Seed materials
    const seedSQL = `
      INSERT INTO materials (slug, name, unit) VALUES
        ('plastic', 'Plastic', 'kg'),
        ('paper', 'Paper', 'kg'),
        ('metal', 'Metal', 'kg'),
        ('glass', 'Glass', 'kg'),
        ('e-waste', 'E-Waste', 'kg'),
        ('cardboard', 'Cardboard', 'kg'),
        ('rubber', 'Rubber', 'kg'),
        ('textile', 'Textile', 'kg')
      ON CONFLICT (slug) DO NOTHING;
    `;
    await pool.query(seedSQL);
    console.log("Materials seeded");

    // Seed pricing rates
    const pricingSQL = `
      INSERT INTO pricing_rates (material_id, rate_per_unit, source)
      SELECT m.id, r.rate, 'seed'
      FROM (VALUES
        ('plastic', 15.00),
        ('paper', 12.00),
        ('metal', 35.00),
        ('glass', 8.00),
        ('e-waste', 50.00),
        ('cardboard', 10.00),
        ('rubber', 20.00),
        ('textile', 18.00)
      ) AS r(slug, rate)
      JOIN materials m ON m.slug = r.slug
      WHERE NOT EXISTS (
        SELECT 1 FROM pricing_rates pr WHERE pr.material_id = m.id
      );
    `;
    await pool.query(pricingSQL);
    console.log("Pricing rates seeded");

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Database setup failed!", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
