const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const getIgnoredList = async (req, res) => {
    const userId = 1; // Hardcoded for testing

    try {
        // Query to get users who trust me but I have ignored
        const query = `
            SELECT u.* 
            FROM "user" u
            WHERE u.userid IN (
                SELECT ut1.user1
                FROM "user_trust" ut1
                WHERE ut1.user2 = $1 
                AND ut1.tstatus = 'trusts'
                INTERSECT
                SELECT ut2.user2
                FROM "user_trust" ut2
                WHERE ut2.user1 = $1
                AND ut2.tstatus = 'ignored'
            )
        `;

        const result = await pool.query(query, [userId]);

        // Log the query result for debugging
        console.log('Users who trust me but are ignored found:', result.rows.length);

        // Transform the data to match the expected user object format
        const ignoredUsers = result.rows.map(user => ({
            user: {
                id: user.userid,
                username: user.username,
                name: user.realname,
                phone: user.phone,
                profileImage: user.profileimage
            }
        }));

        // Return the list of ignored users who trust me
        return res.json({
            success: true,
            users: ignoredUsers
        });

    } catch (error) {
        console.error('Error getting ignored users list:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while fetching ignored users"
            }
        });
    }
};

module.exports = {
    getIgnoredList
};