const pool = require("../../db");

const getConnectedList = async (req, res) => {
  const userId = req.testUserId;

  try {
    // Query to get mutually trusted users (users who trust each other)
    const query = `
            SELECT 
                u.id,
                u.username,
                u.name,
                u.phone,
                u.email,
                u.company_name,
                u.city,
                u.bio
            FROM "up_users" u
            WHERE u.id IN (
                SELECT ut1.user2
                FROM "user_trust" ut1
                WHERE ut1.user1 = $1 
                AND ut1.status = 'trusts'
                INTERSECT
                SELECT ut2.user1
                FROM "user_trust" ut2
                WHERE ut2.user2 = $1
                AND ut2.status = 'trusts'
            )
            AND u.confirmed = true
            AND u.blocked = false
        `;

    const result = await pool.query(query, [userId]);

    // Log the query result for debugging
    console.log("Mutually trusted users found:", result.rows.length);

    // Transform the data to match the expected user object format
    const connectedUsers = result.rows.map((user) => ({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        companyName: user.company_name,
        city: user.city,
        bio: user.bio,
      },
    }));

    // Return the list of connected users
    return res.json({
      success: true,
      users: connectedUsers,
    });
  } catch (error) {
    console.error("Error getting connected users list:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error while fetching connected users",
      },
    });
  }
};

module.exports = {
  getConnectedList,
};
