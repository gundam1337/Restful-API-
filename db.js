const { Pool } = require("pg");
const { config } = require("./src/config/config"); // Destructure to get config from the exports

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl,
});

// Add connection test
pool
  .connect()
  .then((client) => {
    console.log("Database connected successfully");
    console.log(
      "Using database:",
      config.database.url.replace(/:[^:]*@/, ":****@")
    );

    // Test query to list tables
    return client
      .query(
        `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
      )
      .then((result) => {
        console.log(
          "Available tables:",
          result.rows.map((row) => row.table_name)
        );
        client.release();
      })
      .catch((err) => {
        client.release();
        throw err;
      });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = pool;
