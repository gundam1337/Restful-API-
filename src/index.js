const express = require("express");
const router = express.Router();
const cors = require("cors");
const { Pool } = require("pg");
const config = require("./config/config");
const userRoutes = require("./routes/userRoutes");
const trustRoutes = require("./routes/trustRoutes");
const statusRoutes = require("./routes/statusRoutes");
const trustedRoutes = require("./routes/trustedRoutes");
const trustingRoutes = require("./routes/trustingRoutes");
const trustingList2Routes = require("./routes/trustingList2Routes");
// const blockedRoutes = require("./routes/blockedRoutes");
// const blockedMeRoutes = require("./routes/blockedMeRoutes");
// const ignoredRoutes = require("./routes/ignoredRoutes");
// const connectedRoutes = require("./routes/connectedRoutes");
// const updateStatusRoutes = require("./routes/updateStatusRoutes");

const { setTestUserId, getTestUserId } = require('./test/testStore');


const app = express();
const port = config.server.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl,
});

// Database connection retry mechanism
const connectWithRetry = async () => {
  try {
    console.log("Attempting to connect to aikon database...");
    await pool.connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Connection failed. Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Test database connection endpoint
app.get("/test-db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    res.json({
      success: true,
      message: "Connected to aikon database successfully",
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({
      success: false,
      message: "Error connecting to database",
      error: err.message,
    });
  }
});

// List all tables endpoint
app.get("/tables", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    client.release();
    res.json({
      success: true,
      tables: result.rows,
    });
  } catch (err) {
    console.error("Error fetching tables:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

const addTestUser = (req, res, next) => {
    req.testUserId = getTestUserId();
    next();
};

// New route to set test user ID
app.get('/set-test-user/:userId', (req, res) => {
    const newUserId = parseInt(req.params.userId);
    
    if (isNaN(newUserId)) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Invalid user ID provided"
            }
        });
    }

    setTestUserId(newUserId);
    res.json({
        success: true,
        message: `Test user ID set to ${newUserId}`
    });
});

// Routes
app.use(addTestUser);

app.use("/api", userRoutes);
app.use("/api", trustRoutes);
app.use("/", addTestUser,statusRoutes);
app.use("/",addTestUser, trustedRoutes);
app.use("/",addTestUser, trustingRoutes);
app.use("/",addTestUser, trustingList2Routes);
// app.use("/", blockedRoutes);
// app.use("/", blockedMeRoutes);
// app.use("/", ignoredRoutes);
// app.use("/", connectedRoutes);
// app.use("/", updateStatusRoutes);

// Start server and connect to database
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    "Database URL:",
    config.database.url.replace(/:[^:]*@/, ":****@")
  );
  connectWithRetry();
});

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing pool and shutting down...");
  try {
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

// Export pool for use in route handlers
module.exports = { pool };