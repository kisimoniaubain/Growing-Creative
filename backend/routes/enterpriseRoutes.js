const express = require("express");
const {
  createEnterprise,
  getEnterprises,
  getFundStats,
} = require("../controllers/enterprises");

const router = express.Router();

router.get("/", getEnterprises);
router.post("/", createEnterprise);
router.get("/fund/stats", getFundStats);

module.exports = router;
