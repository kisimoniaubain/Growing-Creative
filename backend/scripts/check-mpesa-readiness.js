require("dotenv").config();

const baseUrl = (process.env.BACKEND_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const run = async () => {
  const url = `${baseUrl}/api/donations/payment-readiness`;
  const response = await fetch(url, { method: "GET" });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || `Readiness request failed (${response.status}).`;
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }

  const mpesa = payload?.mpesa || {};
  const checks = Array.isArray(mpesa.checks) ? mpesa.checks : [];
  const ready = Boolean(mpesa.readyLiveCharge);
  const simulationEnabled = Boolean(mpesa.simulationEnabled);

  console.log(`M-Pesa Environment: ${mpesa.env || "unknown"}`);
  console.log(`Simulation Enabled: ${simulationEnabled ? "YES" : "NO"}`);
  for (const check of checks) {
    console.log(`${check?.pass ? "PASS" : "FAIL"}: ${check?.message || check?.key || "Unknown check"}`);
  }

  if (ready) {
    console.log("READY: Live M-Pesa debit is enabled.");
    return;
  }

  if (simulationEnabled) {
    console.log("INFO: Simulation mode is enabled for local demos. Live debit is not active.");
    return;
  }

  console.error("NOT READY: Live M-Pesa debit is blocked until all checks pass.");
  process.exit(1);
};

run().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
});
