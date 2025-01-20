const { Pool } = require("pg");
const config = require("./src/config/config");

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl
});

module.exports = pool;