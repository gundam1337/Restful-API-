const pool = require('../../db'); // Use the shared pool instance

const getIgnoredList = async (req, res) => {
   const userId = req.testUserId; // Using the test middleware

   try {
       // Updated query to match your schema and use proper table/column names
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
           FROM "up_users" u
           WHERE u.id IN (
               SELECT ut1.user1
               FROM "user_trust" ut1
               WHERE ut1.user2 = $1 
               AND ut1.status = 'trusts'
               INTERSECT
               SELECT ut2.user2
               FROM "user_trust" ut2
               WHERE ut2.user1 = $1
               AND ut2.status = 'ignored'
           )
           AND u.blocked = false
       `;

       const result = await pool.query(query, [userId]);

       console.log('Users who trust me but are ignored found:', result.rows.length);

       const ignoredUsers = result.rows.map(user => ({
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