const express = require('express');
const router = express.Router();
const { getBlockedMeList } = require('../controllers/blockedMeController');

// GET /blocked-me-list
router.get('/blocked-me-list', getBlockedMeList);

module.exports = router;