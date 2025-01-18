const express = require('express');
const router = express.Router();
const { getTrustedList } = require('../controllers/trustedController');

// GET /trusted-list
router.get('/trusted-list', getTrustedList);

module.exports = router;