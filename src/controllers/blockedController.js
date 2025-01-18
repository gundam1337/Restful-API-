const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const getBlockedList = async (req, res) => {
    const userId = 1; // Hardcoded for testing

    try {
        // Query to get all users blocked by the current user
        const query = `
            SELECT u.* 
            FROM "user_trust" ut
            JOIN "user" u ON ut.user2 = u.userid
            WHERE ut.user1 = $1 
            AND ut.tstatus = 'blocked'
        `;

        const result = await pool.query(query, [userId]);

        // Log the query result for debugging
        console.log('Blocked users found:', result.rows.length);

        // Transform the data to match the expected user object format
        const blockedUsers = result.rows.map(user => ({
            user: {
                id: user.userid,
                username: user.username,
                name: user.realname,
                phone: user.phone,
                profileImage: user.profileimage
            }
        }));

        // Return the list of blocked users
        return res.json({
            success: true,
            users: blockedUsers
        });

    } catch (error) {
        console.error('Error getting blocked users list:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while fetching blocked users"
            }
        });
    }
};

module.exports = {
    getBlockedList
};