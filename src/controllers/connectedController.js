const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const getConnectedList = async (req, res) => {
    const userId = 1; // Hardcoded for testing

    try {
        // Query to get mutually trusted users (users who trust each other)
        const query = `
            SELECT u.* 
            FROM "user" u
            WHERE u.userid IN (
                SELECT ut1.user2
                FROM "user_trust" ut1
                WHERE ut1.user1 = $1 
                AND ut1.tstatus = 'trusts'
                INTERSECT
                SELECT ut2.user1
                FROM "user_trust" ut2
                WHERE ut2.user2 = $1
                AND ut2.tstatus = 'trusts'
            )
        `;

        const result = await pool.query(query, [userId]);

        // Log the query result for debugging
        console.log('Mutually trusted users found:', result.rows.length);

        // Transform the data to match the expected user object format
        const connectedUsers = result.rows.map(user => ({
            user: {
                id: user.userid,
                username: user.username,
                name: user.realname,
                phone: user.phone,
                profileImage: user.profileimage
            }
        }));

        // Return the list of connected users
        return res.json({
            success: true,
            users: connectedUsers
        });

    } catch (error) {
        console.error('Error getting connected users list:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while fetching connected users"
            }
        });
    }
};

module.exports = {
    getConnectedList
};