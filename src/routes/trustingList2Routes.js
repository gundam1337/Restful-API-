const express = require('express');
const router = express.Router();
const { getTrustingList2 } = require('../controllers/trustingList2Controller');

// GET /trusting-list2
router.get('/trusting-list2', getTrustingList2);

module.exports = router;