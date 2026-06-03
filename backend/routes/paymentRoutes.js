const express = require("express");
const { initializeHostedCheckout, handleFlutterwaveWebhook } = require("../controllers/donations");

const router = express.Router();

router.post("/initialize-checkout", initializeHostedCheckout);
router.post("/webhook/flutterwave", handleFlutterwaveWebhook);

module.exports = router;
