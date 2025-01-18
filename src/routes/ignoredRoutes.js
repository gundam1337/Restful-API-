const express = require('express');
const router = express.Router();
const { getIgnoredList } = require('../controllers/ignoredController');

// GET /ignored-list
router.get('/ignored-list', getIgnoredList);

module.exports = router;