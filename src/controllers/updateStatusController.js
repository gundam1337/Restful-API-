const pool = require("../../db"); // Use the shared pool instance

const updateStatus = async (req, res) => {
  const userId = req.testUserId;
  console.log("User ID:", userId);
  const strangerId = req.params["strangerid"];
  console.log("Stranger ID:", strangerId);
  const status = req.params.status;
  console.log("Status:", status);

  try {
    // Validate input
    if (!strangerId || isNaN(strangerId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid stranger ID provided",
        },
      });
    }

    // Validate status
    const validStatuses = ["trusts", "blocked", "none", "ignored"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid status provided",
        },
      });
    }

    // Update or insert the trust relationship where user1 is the current user
    const query = `
            INSERT INTO "user_trust" (user1, user2, status)
            VALUES ($1, $2, $3)
            ON CONFLICT (user1, user2)
            DO UPDATE SET status = $3
            RETURNING *
        `;

    const result = await pool.query(query, [userId, strangerId, status]);

    // Log the query result for debugging
    console.log("Trust relationship updated:", result.rows[0]);

    // Return the updated relationship
    return res.json({
      success: true,
      userid1: result.rows[0].user1,
      userid2: result.rows[0].user2,
    });
  } catch (error) {
    console.error("Error updating trust status:", error);

    // Check if error is due to foreign key violation
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Referenced user does not exist",
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error while updating trust status",
      },
    });
  }
};

module.exports = { updateStatus };
