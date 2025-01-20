const pool = require("../../db"); // Use the shared pool instance

const getBlockedMeList = async (req, res) => {
  const userId = req.testUserId; // Using the test middleware
  console.log("User ID:", userId);
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
           JOIN "up_users" u ON ut.user1 = u.id
           WHERE ut.user2 = $1 
           AND ut.status = 'blocked'
           AND u.blocked = false
       `;

    const result = await pool.query(query, [userId]);

    console.log("Users who blocked me found:", result.rows.length);

    const blockedByUsers = result.rows.map((user) => ({
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
      users: blockedByUsers,
    });
  } catch (error) {
    console.error("Error getting users who blocked me list:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error while fetching users who blocked me",
      },
    });
  }
};

module.exports = {
  getBlockedMeList,
};
