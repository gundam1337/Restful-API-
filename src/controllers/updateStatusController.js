const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const updateStatus = async (req, res) => {
    const userId = 1; // Hardcoded for testing
    const strangerId = req.params.strangerId;
    const status = req.params.status;

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

        // Validate status
        const validStatuses = ['trusts', 'blocked', 'none', 'ignored'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Invalid status provided"
                }
            });
        }

        // Update or insert the trust relationship
        const query = `
            INSERT INTO "user_trust" (user1, user2, tstatus)
            VALUES ($1, $2, $3)
            ON CONFLICT (user1, user2)
            DO UPDATE SET tstatus = $3
            RETURNING *
        `;

        const result = await pool.query(query, [userId, strangerId, status]);

        // Log the query result for debugging
        console.log('Trust relationship updated:', result.rows[0]);

        // Return the updated relationship
        return res.json({
            success: true,
            userid1: result.rows[0].user1,
            userid2: result.rows[0].user2,
            status: result.rows[0].tstatus
        });

    } catch (error) {
        console.error('Error updating trust status:', error);
        
        // Check if error is due to foreign key violation
        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Referenced user does not exist"
                }
            });
        }

        return res.status(500).json({
            success: false,
            error: {
                message: "Internal server error while updating trust status"
            }
        });
    }
};

module.exports = {
    updateStatus
};