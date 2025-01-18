const express = require('express');
const router = express.Router();
const { getConnectedList } = require('../controllers/connectedController');

// GET /connected-list
router.get('/connected-list', getConnectedList);

module.exports = router;