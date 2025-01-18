const express = require('express');
const router = express.Router();
const { getTrustingList } = require('../controllers/trustingController');

// GET /trusting-list1
router.get('/trusting-list1', getTrustingList);

module.exports = router;