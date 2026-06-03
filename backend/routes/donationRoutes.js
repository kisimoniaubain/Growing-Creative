const express = require("express");
const {
	createContribution,
	getContributions,
	getDonationConfig,
	getPublicPaymentReadiness,
	getPendingManualContributions,
	getPaymentRoutingSummary,
	handleMobileMoneyCallback,
	initializeHostedCheckout,
	initiateMobileMoneyCharge,
	verifyManualContribution,
	updateDonationConfig,
} = require("../controllers/donations");

const router = express.Router();

router.get("/", getContributions);
router.get("/config", getDonationConfig);
router.get("/payment-readiness", getPublicPaymentReadiness);
router.get("/admin/pending", getPendingManualContributions);
router.get("/payment-routing-summary", getPaymentRoutingSummary);
router.patch("/admin/verify/:id", verifyManualContribution);
router.put("/config", updateDonationConfig);
router.post("/checkout/initialize", initializeHostedCheckout);
router.post("/mobile-money/send", initiateMobileMoneyCharge);
router.post("/mobile-money/callback", handleMobileMoneyCallback);
router.post("/contribute", createContribution);

module.exports = router;
