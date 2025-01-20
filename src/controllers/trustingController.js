const pool = require('../../db'); // Use the shared pool instance

const getTrustingList = async (req, res) => {
    const userId = req.testUserId; // Using the test middleware

    try {
        // Updated query to match the specification
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
        `;

        const result = await pool.query(query, [userId]);

        
        // Transform the data to match the expected user object format
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