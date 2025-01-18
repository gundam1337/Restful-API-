const express = require('express');
const router = express.Router();
const { updateStatus } = require('../controllers/updateStatusController');

// POST /usertrust/update-status/:status/:stranger-id
router.post('/usertrust/update-status/:status/:strangerId', updateStatus);

module.exports = router;