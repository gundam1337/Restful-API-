const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const statusRoutes = require("./routes/statusRoutes");
const trustedRoutes = require("./routes/trustedRoutes");
const trustingRoutes = require("./routes/trustingRoutes");
const trustingList2Routes = require("./routes/trustingList2Routes");
const blockedRoutes = require("./routes/blockedRoutes");
const blockedMeRoutes = require("./routes/blockedMeRoutes");
const ignoredRoutes = require("./routes/ignoredRoutes");
const connectedRoutes = require("./routes/connectedRoutes");
const updateStatusRoutes = require("./routes/updateStatusRoutes");

const config = require("./config");

// Add this line

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: config.database.url,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Function to try database connection
const connectWithRetry = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
    console.log("Database URL:", process.env.DATABASE_URL); // Add this to debug
  } catch (err) {
    console.error("Database connection error:", err);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

app.use("/", statusRoutes);
app.use("/", trustedRoutes);
app.use("/", trustingRoutes);
app.use("/", trustingList2Routes);
app.use("/", blockedRoutes);
app.use("/", blockedMeRoutes);
app.use("/", ignoredRoutes);
app.use("/", connectedRoutes);
app.use("/", updateStatusRoutes);

// Start server and connect to database
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  connectWithRetry();
});

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
