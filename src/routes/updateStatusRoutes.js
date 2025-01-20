const express = require("express");
const router = express.Router();
const { updateStatus } = require("../controllers/updateStatusController");

router.post("/usertrust/update-status/:status/:strangerid", updateStatus);

module.exports = router;
