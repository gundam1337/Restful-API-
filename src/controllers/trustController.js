const pool = require('../../db');

const getAllTrusts = async (req, res) => {
  try {
    const query = `
        SELECT 
            user1,
            user2,
            status
        FROM user_trust
        ORDER BY user1, user2
    `;

    const result = await pool.query(query);

    // If no records exist
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No trust relations found",
      });
    }

    // Return all records
    return res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching trust relations:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error while fetching trust relations",
      },
    });
  }
};


module.exports = {
  getAllTrusts
};
