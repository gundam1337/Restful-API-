const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const getTrustedList = async (req, res) => {
  console.log("Hello World");

  const userId = 1; // Hardcoded for testing, should come from authentication

  try {
    // Query to get all users that the current user trusts
    const query = `
            SELECT u.* 
            FROM "user_trust" ut
            JOIN "user" u ON ut.user2 = u.userid
            WHERE ut.user1 = $1 
            AND ut.tstatus = 'trusts'
        `;

    const result = await pool.query(query, [userId]);

    // Log the query result for debugging
    console.log("Trusted users found:", result.rows.length);

    // Transform the data to match the expected user object format
    const trustedUsers = result.rows.map((user) => ({
      user: {
        id: user.userid,
        username: user.username,
        name: user.realname,
        phone: user.phone,
        profileImage: user.profileimage,
      },
    }));

    // Return the list of trusted users
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
