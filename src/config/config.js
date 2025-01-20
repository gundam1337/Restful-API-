const constructDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  return `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/aikon`;
};

const config = {
  database: {
    url:
      constructDatabaseUrl() ||
      "postgresql://postgres:AIKON_2@167.172.66.102:5432/aikon",
    ssl: {
      rejectUnauthorized: false,
    },
  },
  server: {
    port: process.env.PORT || 3000,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
};

const checkDatabaseTables = async (pool) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = 'up_users'
    `);
    client.release();

    if (result.rows.length === 0) {
      console.error("WARNING: up_users table not found in database");
      console.error(
        "Available tables:",
        result.rows.map((r) => r.table_name).join(", ")
      );
    } else {
      console.log("up_users table found successfully");
    }
  } catch (err) {
    console.error("Error checking database tables:", err);
  }
};

module.exports = { config, checkDatabaseTables };
