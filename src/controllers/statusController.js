const pool = require('../../db');

const checkStatus = async (req, res) => {
    const strangerId = req.params.strangerId;
    const userId = req.testUserId;

    console.log("User ID:", userId);
   

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

        // Updated query with new table name and column name
        const query = `
            SELECT status 
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
            status: result.rows[0].status  // Updated from tstatus to status
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