const pool = require('../../db'); // Use the shared pool instance

const getTrustingList2 = async (req, res) => {
    const userId = req.testUserId; // Using the test middleware
    console.log("User ID:", userId);

    try {
        // Updated query to match the specification using EXCEPT
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
            AND ut.status = 'trusts'
            AND u.blocked = false
            AND ut.user1 NOT IN (
                SELECT user2
                FROM "user_trust"
                WHERE user1 = $1
                AND status = 'ignored'
            )
        `;

        const result = await pool.query(query, [userId]);

        console.log('Users who trust me (not ignored) found:', result.rows.length);

        const trustingUsers = result.rows.map(user => ({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                phone: user.phone,
                email: user.email,
                bio: user.bio,
                city: user.city,
                companyName: user.company_name
            }
        }));

        return res.json({
            success: true,
            users: trustingUsers
        });

    } catch (error) {
        console.error('Error getting trusting users list (not ignored):', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while fetching trusting users"
            }
        });
    }
};

module.exports = {
    getTrustingList2
};