const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const checkStatus = async (req, res) => {
    const strangerId = req.params.strangerId;
    const userId = 1; // Hardcoded for testing

    try {
        // Validate input
        if (!strangerId || isNaN(strangerId)) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Invalid stranger ID provided"
                }
            });
        }

        // Log the inputs for debugging
        console.log(`Checking status between user ${userId} and stranger ${strangerId}`);

        // Query to check status with correct case sensitivity
        const query = `
            SELECT tstatus 
            FROM "user_trust" 
            WHERE ((user1 = $1 AND user2 = $2)
                OR (user2 = $1 AND user1 = $2))
        `;

        const result = await pool.query(query, [userId, strangerId]);

        // Log the query result for debugging
        console.log('Query result:', result.rows);

        // If no relationship exists
        if (result.rows.length === 0) {
            return res.json({
                success: true,
                status: "none"
            });
        }

        // Return the found status
        return res.json({
            success: true,
            status: result.rows[0].tstatus
        });

    } catch (error) {
        console.error('Error checking status:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while checking status"
            }
        });
    }
};

module.exports = {
    checkStatus
};