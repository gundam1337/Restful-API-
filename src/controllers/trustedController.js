const pool = require("../../db");

const getTrustedList = async (req, res) => {
  const userId = req.testUserId; // Using the test middleware approach

  try {
    // Simplified query to only get users that User1 trusts
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
          AND ut.status = 'trusts'
      `;

    const result = await pool.query(query, [userId]);


    const trustedUsers = result.rows.map((user) => ({
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
      users: trustedUsers,
    });
  } catch (error) {
    console.error("Error getting trusted list:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error while fetching trusted users",
      },
    });
  }
};

module.exports = {
  getTrustedList,
};
