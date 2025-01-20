const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');

// GET /api/users
router.get('/users', getAllUsers);

// GET /api/users/:id
router.get('/users/:id', getUserById);

module.exports = router;