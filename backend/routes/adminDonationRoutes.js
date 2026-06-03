const express = require("express");
const { getPendingManualContributions, verifyManualContribution } = require("../controllers/donations");

const router = express.Router();

router.get("/pending", getPendingManualContributions);
router.patch("/verify/:id", verifyManualContribution);

module.exports = router;
