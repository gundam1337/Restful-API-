const express = require('express');
const router = express.Router();
const { getAllTrusts } = require('../controllers/trustController');

// GET /api/trusts
router.get('/trusts', getAllTrusts);



module.exports = router;