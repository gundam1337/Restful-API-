const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const getBlockedMeList = async (req, res) => {
    const userId = 3; // Hardcoded for testing

    try {
        // Query to get all users who have blocked the current user
        const query = `
            SELECT u.* 
            FROM "user_trust" ut
            JOIN "user" u ON ut.user1 = u.userid
            WHERE ut.user2 = $1 
            AND ut.tstatus = 'blocked'
        `;

        const result = await pool.query(query, [userId]);

        // Log the query result for debugging
        console.log('Users who blocked me found:', result.rows.length);

        // Transform the data to match the expected user object format
        const blockedByUsers = result.rows.map(user => ({
            user: {
                id: user.userid,
                username: user.username,
                name: user.realname,
                phone: user.phone,
                profileImage: user.profileimage
            }
        }));

        // Return the list of users who blocked me
        return res.json({
            success: true,
            users: blockedByUsers
        });

    } catch (error) {
        console.error('Error getting users who blocked me list:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while fetching users who blocked me"
            }
        });
    }
};

module.exports = {
    getBlockedMeList
};