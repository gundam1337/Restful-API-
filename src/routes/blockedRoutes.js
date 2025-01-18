const express = require('express');
const router = express.Router();
const { getBlockedList } = require('../controllers/blockedController');

// GET /blocked-list
router.get('/blocked-list', getBlockedList);

module.exports = router;