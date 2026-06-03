const express = require("express");
const { submitApplication, getApplications } = require("../controllers/applications");

const router = express.Router();

router.post("/", submitApplication);
router.get("/", getApplications);

module.exports = router;
