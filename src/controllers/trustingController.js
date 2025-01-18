const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const getTrustingList = async (req, res) => {
    const userId = 1; // Hardcoded for testing, should come from authentication

    try {
        // Query to get all users who trust the current user
        const query = `
            SELECT u.* 
            FROM "user_trust" ut
            JOIN "user" u ON ut.user1 = u.userid
            WHERE ut.user2 = $1 
            AND ut.tstatus = 'trusts'
        `;

        const result = await pool.query(query, [userId]);

        // Log the query result for debugging
        console.log('Users who trust me found:', result.rows.length);

        // Transform the data to match the expected user object format
        const trustingUsers = result.rows.map(user => ({
            user: {
                id: user.userid,
                username: user.username,
                name: user.realname,
                phone: user.phone,
                profileImage: user.profileimage
            }
        }));

        // Return the list of trusting users
        return res.json({
            success: true,
            users: trustingUsers
        });

    } catch (error) {
        console.error('Error getting trusting users list:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while fetching trusting users"
            }
        });
    }
};

module.exports = {
    getTrustingList
};