const pool = require("../../db"); // Use the shared pool instance

const getBlockedList = async (req, res) => {
  const userId = req.testUserId; // Using the test middleware

  try {
    // Updated query to match your schema
    const query = `
            SELECT 
                u.id,
                u.username,
                u.name,
                u.phone,
                u.bio,
                u.city,
                u.company_name,
                u.email
            FROM "user_trust" ut
            JOIN "up_users" u ON ut.user2 = u.id
            WHERE ut.user1 = $1 
            AND ut.status = 'blocked'
            AND u.blocked = false
        `;

    const result = await pool.query(query, [userId]);

    console.log("Blocked users found:", result.rows.length);

    const blockedUsers = result.rows.map((user) => ({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        bio: user.bio,
        city: user.city,
        companyName: user.company_name,
      },
    }));

    return res.json({
      success: true,
      users: blockedUsers,
    });
  } catch (error) {
    console.error("Error getting blocked users list:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error while fetching blocked users",
      },
    });
  }
};

module.exports = {
  getBlockedList,
};
