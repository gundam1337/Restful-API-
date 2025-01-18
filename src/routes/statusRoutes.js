const express = require('express');
const router = express.Router();
const { checkStatus } = require('../controllers/statusController');

// GET /check-status/:strangerId
router.get('/check-status/:strangerId', checkStatus);

module.exports = router;