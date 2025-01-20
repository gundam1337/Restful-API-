const pool = require('../../db');


const getAllUsers = async (req, res) => {
  try {
    const client = await pool.connect();
    // Verify we're connected to the right database
    await client.query('SET search_path TO public');
    const result = await client.query(`
      SELECT up_users.*, up_roles.name as role_name 
      FROM up_users 
      LEFT JOIN up_users_role_lnk ON up_users.id = up_users_role_lnk.user_id
      LEFT JOIN up_roles ON up_users_role_lnk.role_id = up_roles.id
    `);
    client.release();
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    await client.query('SET search_path TO public');
    const result = await client.query(`
      SELECT up_users.*, up_roles.name as role_name 
      FROM up_users 
      LEFT JOIN up_users_role_lnk ON up_users.id = up_users_role_lnk.user_id
      LEFT JOIN up_roles ON up_users_role_lnk.role_id = up_roles.id
      WHERE up_users.id = $1
    `, [id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: err.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById
};