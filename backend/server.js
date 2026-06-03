const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const enterpriseRoutes = require("./routes/enterpriseRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const donationRoutes = require("./routes/donationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminDonationRoutes = require("./routes/adminDonationRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res
    .status(200)
    .type("text/plain")
    .send("Growing Creative API is running. Use /api/health or /healthz for health checks.");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "Growing Creative API" });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/enterprises", enterpriseRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/donations", adminDonationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;

const maskValue = (value, { start = 2, end = 2 } = {}) => {
  const normalized = String(value || "");
  if (!normalized) return "(not set)";
  if (normalized.length <= start + end) return `${normalized.slice(0, 1)}***`;
  return `${normalized.slice(0, start)}***${normalized.slice(-end)}`;
};

const logPaymentRoutingSummary = () => {
  const mpesaShortcode = process.env.MPESA_SHORTCODE || "";
  const airtelClientId = process.env.AIRTEL_CLIENT_ID || "";
  const mpesaCallback = process.env.MPESA_CALLBACK_URL || "";
  const airtelCallback = process.env.AIRTEL_CALLBACK_URL || "";

  console.log("Payment routing summary:");
  console.log(`- MPESA_SHORTCODE: ${maskValue(mpesaShortcode, { start: 2, end: 2 })}`);
  console.log(`- MPESA_CALLBACK_URL set: ${Boolean(mpesaCallback)}`);
  console.log(`- AIRTEL_CLIENT_ID: ${maskValue(airtelClientId, { start: 3, end: 2 })}`);
  console.log(`- AIRTEL_CALLBACK_URL set: ${Boolean(airtelCallback)}`);
};

app.listen(PORT, () => {
  console.log(`Growing Creative backend running on port ${PORT}`);
  logPaymentRoutingSummary();
});
