const Donation = require("../models/Donation");

const buildTransactionId = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const nonce = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `Growing Creative-${stamp}-${nonce}`;
};

const allocationRules = {
  seedCapital: 0.8,
  hardware: 0.15,
  audits: 0.05,
};

const getNestedValue = (obj, path) => path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const safeReadJson = async (response) => {
  const rawText = await response.text();
  if (!rawText) return {};

  try {
    return JSON.parse(rawText);
  } catch (_error) {
    return {};
  }
};

const parseMpesaCallback = (body) => {
  const stk = getNestedValue(body, ["Body", "stkCallback"]);
  if (!stk) return null;

  const metadataItems = Array.isArray(stk.CallbackMetadata?.Item) ? stk.CallbackMetadata.Item : [];
  const metadataMap = metadataItems.reduce((acc, item) => {
    if (item?.Name) acc[item.Name] = item.Value;
    return acc;
  }, {});

  return {
    provider: "mpesa",
    requestId: stk.CheckoutRequestID || null,
    resultCode: Number(stk.ResultCode),
    resultDesc: stk.ResultDesc || "",
    success: Number(stk.ResultCode) === 0,
    receipt: metadataMap.MpesaReceiptNumber || null,
  };
};

const parseAirtelCallback = (body) => {
  const status = String(body?.status?.code || body?.status || body?.transaction?.status || "").toLowerCase();
  const requestId = body?.data?.transaction?.id || body?.data?.transaction?.airtel_money_id || body?.data?.transaction?.reference_id || body?.reference || body?.transaction?.id || null;

  if (!requestId && !status) return null;

  const success = status === "200" || status === "success" || status === "successful" || status === "ts";
  const knownFailure = status === "failed" || status === "tf" || status === "400" || status === "500";

  return {
    provider: "airtel-money",
    requestId,
    resultCode: body?.status?.code || status,
    resultDesc: body?.status?.message || body?.message || "",
    success,
    knownFailure,
    receipt: body?.data?.transaction?.id || body?.transaction?.id || null,
  };
};

const normalizeKenyanPhoneNumber = (rawValue) => {
  const digits = String(rawValue || "").replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  return null;
};

const normalizeManualPhoneNumber = (rawValue) => {
  const digits = String(rawValue || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  return digits;
};

const buildManualTransactionId = () => `Growing Creative-MANUAL-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const manualMpesaCodePattern = /^[A-Z][A-Z0-9]{9}$/;
const manualReceiptRateLimitState = new Map();
const MANUAL_RECEIPT_RATE_LIMIT_MAX = Number(process.env.MANUAL_RECEIPT_RATE_LIMIT_MAX || 5);
const MANUAL_RECEIPT_RATE_LIMIT_WINDOW_MS = Number(process.env.MANUAL_RECEIPT_RATE_LIMIT_WINDOW_MS || (10 * 60 * 1000));

const consumeManualReceiptAttempt = (key) => {
  if (!key) {
    return {
      limited: false,
      remainingAttempts: MANUAL_RECEIPT_RATE_LIMIT_MAX,
      retryAfterSeconds: 0,
    };
  }

  const now = Date.now();
  const current = manualReceiptRateLimitState.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + MANUAL_RECEIPT_RATE_LIMIT_WINDOW_MS;
    manualReceiptRateLimitState.set(key, { count: 1, resetAt });
    return {
      limited: false,
      remainingAttempts: Math.max(MANUAL_RECEIPT_RATE_LIMIT_MAX - 1, 0),
      retryAfterSeconds: Math.max(Math.ceil((resetAt - now) / 1000), 0),
    };
  }

  const retryAfterSeconds = Math.max(Math.ceil((current.resetAt - now) / 1000), 0);

  if (current.count >= MANUAL_RECEIPT_RATE_LIMIT_MAX) {
    return {
      limited: true,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  current.count += 1;
  manualReceiptRateLimitState.set(key, current);
  return {
    limited: false,
    remainingAttempts: Math.max(MANUAL_RECEIPT_RATE_LIMIT_MAX - current.count, 0),
    retryAfterSeconds,
  };
};

const getMpesaConfig = () => {
  const env = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
  const baseUrl = env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

  return {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortcode: process.env.MPESA_SHORTCODE,
    passkey: process.env.MPESA_PASSKEY,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
    baseUrl,
  };
};

const isMpesaSimulationEnabled = () => {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) return false;

  const raw = String(process.env.MPESA_SIMULATION_MODE || "").trim().toLowerCase();
  if (!raw) return true;
  return raw === "true" || raw === "1" || raw === "yes";
};

const getMpesaReadiness = () => {
  const callbackUrl = process.env.MPESA_CALLBACK_URL || "";
  const configured = Boolean(
    process.env.MPESA_CONSUMER_KEY
    && process.env.MPESA_CONSUMER_SECRET
    && process.env.MPESA_SHORTCODE
    && process.env.MPESA_PASSKEY
    && process.env.MPESA_CALLBACK_URL
  );
  const callbackHttps = callbackUrl.startsWith("https://");
  const simulationEnabled = isMpesaSimulationEnabled();
  const simulationRequested = String(process.env.MPESA_SIMULATION_MODE || "").trim().toLowerCase();
  const simulationForcedOffInProduction = process.env.NODE_ENV === "production" && simulationRequested === "true";

  const checks = [
    { key: "configured", pass: configured, message: configured ? "Credentials configured" : "Missing MPESA_* credentials" },
    { key: "callbackHttps", pass: callbackHttps, message: callbackHttps ? "HTTPS callback URL configured" : "Callback URL must be HTTPS" },
    {
      key: "simulationDisabled",
      pass: !simulationEnabled,
      message: simulationForcedOffInProduction
        ? "Simulation requested but forced OFF in production"
        : simulationEnabled
          ? "Simulation mode is ON"
          : "Simulation mode is OFF",
    },
  ];

  return {
    env: process.env.MPESA_ENV || "sandbox",
    nodeEnv: process.env.NODE_ENV || "development",
    callbackUrl,
    callbackHttps,
    configured,
    simulationEnabled,
    simulationForcedOffInProduction,
    checks,
    readyLiveCharge: checks.every((item) => item.pass),
  };
};

const getMpesaAccessToken = async (baseUrl, consumerKey, consumerSecret) => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const rawBody = await response.text();
  let payload = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch (_error) {
    payload = {};
  }

  if (!response.ok || !payload.access_token) {
    const responseLooksBlocked =
      String(response.headers.get("x-cdn") || "").toLowerCase().includes("imperva")
      || String(rawBody || "").toLowerCase().includes("incapsula")
      || String(rawBody || "").toLowerCase().includes("request unsuccessful");

    if (responseLooksBlocked) {
      throw new Error(
        `M-Pesa token request blocked by Safaricom edge security (Imperva/Incapsula). `
        + `Run backend from an allowed/public network or use a deployed backend for live debit. (HTTP ${response.status})`
      );
    }

    const gatewayMessage = payload?.errorMessage
      || payload?.error_description
      || payload?.message
      || payload?.error
      || (rawBody ? String(rawBody).slice(0, 240) : "")
      || "Failed to fetch M-Pesa access token.";
    throw new Error(`${gatewayMessage} (HTTP ${response.status})`);
  }

  return payload.access_token;
};

const getAirtelConfig = () => {
  const env = process.env.AIRTEL_ENV === "production" ? "production" : "sandbox";
  const baseUrl = env === "production"
    ? (process.env.AIRTEL_BASE_URL_PROD || "https://openapi.airtel.africa")
    : (process.env.AIRTEL_BASE_URL_SANDBOX || "https://openapiuat.airtel.africa");

  return {
    clientId: process.env.AIRTEL_CLIENT_ID,
    clientSecret: process.env.AIRTEL_CLIENT_SECRET,
    country: process.env.AIRTEL_COUNTRY || "KE",
    currency: process.env.AIRTEL_CURRENCY || "KES",
    callbackUrl: process.env.AIRTEL_CALLBACK_URL,
    baseUrl,
  };
};

const getAirtelAccessToken = async (airtel) => {
  const auth = Buffer.from(`${airtel.clientId}:${airtel.clientSecret}`).toString("base64");
  const response = await fetch(`${airtel.baseUrl}/auth/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });

  const payload = await safeReadJson(response);
  const token = payload.access_token || payload?.data?.access_token;

  if (!response.ok || !token) {
    throw new Error(payload.message || payload.error_description || "Failed to fetch Airtel Money access token.");
  }

  return token;
};

const getFlutterwaveConfig = () => ({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  webhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH || "",
  baseUrl: process.env.FLUTTERWAVE_BASE_URL || "https://api.flutterwave.com",
  paymentOptions: process.env.FLUTTERWAVE_PAYMENT_OPTIONS || "mpesa,card,mobilemoneyairtel",
  redirectUrl:
    process.env.FLUTTERWAVE_REDIRECT_URL
    || `${process.env.CLIENT_URL || "http://localhost:5173"}/donation-success`,
});

const parseDonorName = (fullName) => {
  const cleaned = String(fullName || "").trim();
  if (!cleaned) {
    return { firstName: "Guest", lastName: "Donor" };
  }

  const chunks = cleaned.split(/\s+/).filter(Boolean);
  if (chunks.length === 1) {
    return { firstName: chunks[0], lastName: "Donor" };
  }

  return {
    firstName: chunks[0],
    lastName: chunks.slice(1).join(" "),
  };
};

const resolveHostedProvider = (paymentType) => {
  const normalized = String(paymentType || "").toLowerCase();
  if (normalized.includes("airtel")) return "airtel-money";
  if (normalized.includes("mpesa")) return "mpesa";
  return undefined;
};

const verifyFlutterwaveTransaction = async ({ transactionId, flutterwave }) => {
  if (!transactionId || !flutterwave?.secretKey) return null;

  const response = await fetch(`${flutterwave.baseUrl}/v3/transactions/${transactionId}/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${flutterwave.secretKey}`,
    },
  });

  const payload = await safeReadJson(response);
  if (!response.ok || payload?.status !== "success") {
    return null;
  }

  return payload?.data || null;
};

const persistHostedDonation = async ({ payment, txRef }) => {
  const normalizedTxRef = String(txRef || payment?.tx_ref || "").trim();
  if (!normalizedTxRef) return null;

  const numericAmount = Number(payment?.amount);
  if (!numericAmount || numericAmount <= 0) return null;

  const paymentStatus = String(payment?.status || "").toLowerCase();
  const status = paymentStatus === "successful"
    ? "received"
    : paymentStatus === "failed" || paymentStatus === "cancelled"
      ? "failed"
      : "pending";

  const donorName = parseDonorName(payment?.customer?.name);
  const provider = resolveHostedProvider(payment?.payment_type);
  const currency = String(payment?.currency || "KES").toUpperCase();
  const donorEmail = String(payment?.customer?.email || "guest@sseyc.local").trim().toLowerCase();
  const donorPhone = String(payment?.customer?.phone_number || "").trim();
  const gatewayTransactionId = payment?.id ? String(payment.id).trim() : "";

  const payload = {
    transactionId: normalizedTxRef,
    status,
    issuedAt: payment?.created_at ? new Date(payment.created_at) : new Date(),
    amount: numericAmount,
    currency,
    paymentGateway: "hosted-checkout",
    mobileProvider: provider,
    mobileChargeRequestId: gatewayTransactionId || undefined,
    donor: {
      firstName: donorName.firstName,
      lastName: donorName.lastName,
      email: donorEmail,
      phoneNumber: donorPhone || undefined,
    },
    allocation: {
      seedCapital: Number((numericAmount * allocationRules.seedCapital).toFixed(2)),
      hardware: Number((numericAmount * allocationRules.hardware).toFixed(2)),
      audits: Number((numericAmount * allocationRules.audits).toFixed(2)),
    },
    auditTrail: {
      model: "100% direct impact revolving model",
      encryption: "256-bit transport security",
      statement: `Hosted checkout webhook processed (${paymentStatus || "unknown"}).`,
    },
  };

  const existing = await Donation.findOne({ transactionId: normalizedTxRef });
  if (existing) {
    existing.status = payload.status;
    existing.amount = payload.amount;
    existing.currency = payload.currency;
    existing.paymentGateway = payload.paymentGateway;
    existing.mobileProvider = payload.mobileProvider;
    existing.mobileChargeRequestId = payload.mobileChargeRequestId;
    existing.donor = payload.donor;
    existing.allocation = payload.allocation;
    existing.auditTrail = payload.auditTrail;
    await existing.save();
    return existing;
  }

  return Donation.create(payload);
};

const initiateMpesaCharge = async ({ amount, phoneNumber, provider }) => {
  const normalizedPhone = normalizeKenyanPhoneNumber(phoneNumber);
  if (!normalizedPhone) {
    return {
      status: 400,
      body: { message: "Use a valid Kenyan number format (07..., +254..., or 254...)." },
    };
  }

  const mpesa = getMpesaConfig();
  if (!mpesa.consumerKey || !mpesa.consumerSecret || !mpesa.shortcode || !mpesa.passkey || !mpesa.callbackUrl) {
    return {
      status: 500,
      body: { message: "M-Pesa is not fully configured on the server. Add MPESA_* variables in backend .env." },
    };
  }

  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(`${mpesa.shortcode}${mpesa.passkey}${timestamp}`).toString("base64");
  if (isMpesaSimulationEnabled()) {
    const mockId = `SIM-MPESA-${Date.now()}`;
    return {
      status: 200,
      body: {
        message: "M-Pesa simulation mode is enabled.",
        checkoutRequestId: mockId,
        merchantRequestId: mockId,
        customerMessage: "Simulation mode active. No live charge was sent.",
        phoneNumber: normalizedPhone,
        amount: Math.round(amount),
        provider,
      },
    };
  }

  let accessToken;
  try {
    accessToken = await getMpesaAccessToken(mpesa.baseUrl, mpesa.consumerKey, mpesa.consumerSecret);
  } catch (error) {
    return {
      status: 502,
      body: {
        message: "M-Pesa gateway token request failed.",
        error: error.message,
      },
    };
  }

  const stkResponse = await fetch(`${mpesa.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      BusinessShortCode: mpesa.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: mpesa.shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: mpesa.callbackUrl,
      AccountReference: "Growing Creative-DONATION",
      TransactionDesc: "Growing Creative Donation",
    }),
  });

  const stkPayload = await safeReadJson(stkResponse);

  if (!stkResponse.ok || stkPayload.ResponseCode !== "0") {
    return {
      status: 400,
      body: {
        message: stkPayload.errorMessage || stkPayload.ResponseDescription || "Failed to initiate M-Pesa payment request.",
      },
    };
  }

  return {
    status: 200,
    body: {
      message: "M-Pesa prompt sent. Approve it on your phone to complete payment.",
      checkoutRequestId: stkPayload.CheckoutRequestID,
      merchantRequestId: stkPayload.MerchantRequestID,
      customerMessage: stkPayload.CustomerMessage,
      phoneNumber: normalizedPhone,
      amount: Math.round(amount),
      provider,
    },
  };
};

const initiateAirtelCharge = async ({ amount, phoneNumber, provider }) => {
  const normalizedPhone = normalizeKenyanPhoneNumber(phoneNumber);
  if (!normalizedPhone) {
    return {
      status: 400,
      body: { message: "Use a valid Kenyan number format (07..., +254..., or 254...)." },
    };
  }

  const airtel = getAirtelConfig();
  if (!airtel.clientId || !airtel.clientSecret || !airtel.callbackUrl) {
    return {
      status: 500,
      body: {
        message: "Airtel Money is not fully configured on the server. Add AIRTEL_* variables in backend .env.",
      },
    };
  }

  const reference = `Growing Creative-${Date.now()}`;
  const token = await getAirtelAccessToken(airtel);

  const chargeResponse = await fetch(`${airtel.baseUrl}/merchant/v1/payments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Country": airtel.country,
      "X-Currency": airtel.currency,
    },
    body: JSON.stringify({
      reference,
      subscriber: {
        country: airtel.country,
        currency: airtel.currency,
        msisdn: normalizedPhone,
      },
      transaction: {
        amount: Math.round(amount),
        country: airtel.country,
        currency: airtel.currency,
        id: reference,
      },
      callback_url: airtel.callbackUrl,
    }),
  });

  const chargePayload = await safeReadJson(chargeResponse);
  const requestId = chargePayload?.data?.transaction?.id || chargePayload?.data?.transaction?.airtel_money_id || chargePayload?.data?.transaction?.reference_id || reference;

  if (!chargeResponse.ok || chargePayload?.status?.code !== "200") {
    return {
      status: 400,
      body: {
        message: chargePayload?.status?.message || chargePayload?.message || "Failed to initiate Airtel Money payment request.",
      },
    };
  }

  return {
    status: 200,
    body: {
      message: "Airtel Money prompt sent. Approve it on your phone to complete payment.",
      checkoutRequestId: requestId,
      merchantRequestId: requestId,
      customerMessage: chargePayload?.status?.message || "Prompt sent successfully.",
      phoneNumber: normalizedPhone,
      amount: Math.round(amount),
      provider,
    },
  };
};

exports.initiateMobileMoneyCharge = async (req, res) => {
  try {
    const { provider, amount, phoneNumber } = req.body;
    const normalizedProvider = String(provider || "").trim();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "A valid amount is required." });
    }

    if (!['mpesa', 'airtel-money'].includes(normalizedProvider)) {
      return res.status(400).json({ message: "Select M-Pesa or Airtel Money." });
    }

    const result = normalizedProvider === 'mpesa'
      ? await initiateMpesaCharge({ amount: numericAmount, phoneNumber, provider: normalizedProvider })
      : await initiateAirtelCharge({ amount: numericAmount, phoneNumber, provider: normalizedProvider });

    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ message: "Failed to initiate mobile money payment.", error: error.message });
  }
};

exports.initializeHostedCheckout = async (req, res) => {
  try {
    const {
      email,
      phone,
      amount,
      currency = "KES",
      firstName = "",
      lastName = "",
    } = req.body;

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: "A valid amount is required." });
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();
    const normalizedCurrency = String(currency || "KES").trim().toUpperCase();
    const fullName = `${String(firstName || "").trim()} ${String(lastName || "").trim()}`.trim() || "Growing Creative Hub Donor";

    if (!normalizedEmail || !normalizedPhone) {
      return res.status(400).json({ success: false, message: "Email and phone are required." });
    }

    const flutterwave = getFlutterwaveConfig();
    if (!flutterwave.secretKey) {
      return res.status(500).json({
        success: false,
        message: "Flutterwave is not configured. Add FLUTTERWAVE_SECRET_KEY in backend .env.",
      });
    }

    const txRef = `Growing Creative-TXID-${Date.now()}`;
    const response = await fetch(`${flutterwave.baseUrl}/v3/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${flutterwave.secretKey}`,
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: numericAmount,
        currency: normalizedCurrency,
        redirect_url: flutterwave.redirectUrl,
        customer: {
          email: normalizedEmail,
          phone_number: normalizedPhone,
          name: fullName,
        },
        customizations: {
          title: "Growing Creative Innovation Fund",
          description: "Capitalization for Youth Revolving Seed Loans",
        },
        payment_options: flutterwave.paymentOptions,
      }),
    });

    const payload = await safeReadJson(response);
    const checkoutUrl = payload?.data?.link;

    if (!response.ok || payload?.status !== "success" || !checkoutUrl) {
      return res.status(400).json({
        success: false,
        message: payload?.message || "Payment initialization failed.",
      });
    }

    return res.status(200).json({
      success: true,
      checkoutUrl,
      txRef,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal transaction pipeline error.",
      error: error.message,
    });
  }
};

exports.handleFlutterwaveWebhook = async (req, res) => {
  try {
    const flutterwave = getFlutterwaveConfig();
    const providedHash = String(req.headers["verif-hash"] || "").trim();

    if (flutterwave.webhookHash && providedHash !== flutterwave.webhookHash) {
      return res.status(401).json({ message: "Invalid webhook signature." });
    }

    const body = req.body || {};
    const eventType = String(body?.event || "").toLowerCase();
    const webhookData = body?.data || {};
    const txRef = String(webhookData?.tx_ref || "").trim();
    const transactionId = webhookData?.id;

    if (!txRef && !transactionId) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const verifiedPayment = await verifyFlutterwaveTransaction({ transactionId, flutterwave });
    const payment = verifiedPayment || webhookData;

    if (!payment?.tx_ref && txRef) {
      payment.tx_ref = txRef;
    }

    if (eventType && !eventType.includes("charge") && !eventType.includes("payment")) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const savedDonation = await persistHostedDonation({ payment, txRef: payment?.tx_ref || txRef });
    if (!savedDonation) {
      return res.status(200).json({ received: true, ignored: true });
    }

    return res.status(200).json({
      received: true,
      transactionId: savedDonation.transactionId,
      status: savedDonation.status,
    });
  } catch (error) {
    return res.status(200).json({ received: true, error: error.message });
  }
};

const donationConfig = {
  hero: {
    headline: "Capitalize the Future: Expand the Growing Creative Revolving Fund",
    subheadline:
      "100% of your contribution directly funds youth seed loans and critical workshop machinery. Because our fund is revolving, your capital is repaid, recycled, and reinvested to empower generation after generation of young African entrepreneurs.",
  },
  monthlyPrograms: [
    {
      key: "venture-scale-up",
      title: "Venture Scale-Up",
      amount: 500,
      summary: "can scale an existing youth venture with equipment and working capital.",
    },
    {
      key: "education-support",
      title: "Educational Support",
      amount: 250,
      summary: "for 12 months can cover the cost to educate one youth participant.",
    },
    {
      key: "student-ventures",
      title: "Student Ventures",
      amount: 50,
      summary: "can contribute seed funding for student businesses.",
    },
    {
      key: "remote-learning",
      title: "Remote Learning",
      amount: 10,
      summary: "can provide a month of internet data for one learner.",
    },
  ],
  oneTimeTiers: [50, 250, 500, 1500],
};

const resolveAdminKey = () => process.env.ADMIN_DASHBOARD_KEY || process.env.JWT_SECRET;

const maskValue = (value, { start = 2, end = 2 } = {}) => {
  const normalized = String(value || "");
  if (!normalized) return "(not set)";
  if (normalized.length <= start + end) return `${normalized.slice(0, 1)}***`;
  return `${normalized.slice(0, start)}***${normalized.slice(-end)}`;
};

const isAuthorizedAdmin = (req) => {
  const configuredAdminKey = resolveAdminKey();
  const providedAdminKey = req.headers["x-admin-key"];
  return Boolean(configuredAdminKey && providedAdminKey && providedAdminKey === configuredAdminKey);
};

exports.getPaymentRoutingSummary = async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key." });
    }

    const mpesaReadiness = getMpesaReadiness();
    const airtelCallbackUrl = process.env.AIRTEL_CALLBACK_URL || "";
    const flutterwaveRedirectUrl = process.env.FLUTTERWAVE_REDIRECT_URL || "";

    return res.status(200).json({
      mpesa: {
        env: mpesaReadiness.env,
        nodeEnv: mpesaReadiness.nodeEnv,
        shortcodeMasked: maskValue(process.env.MPESA_SHORTCODE || "", { start: 2, end: 2 }),
        callbackUrl: mpesaReadiness.callbackUrl,
        callbackHttps: mpesaReadiness.callbackHttps,
        configured: mpesaReadiness.configured,
        simulationEnabled: mpesaReadiness.simulationEnabled,
        simulationForcedOffInProduction: mpesaReadiness.simulationForcedOffInProduction,
        readyLiveCharge: mpesaReadiness.readyLiveCharge,
      },
      airtel: {
        env: process.env.AIRTEL_ENV || "sandbox",
        clientIdMasked: maskValue(process.env.AIRTEL_CLIENT_ID || "", { start: 3, end: 2 }),
        callbackUrl: airtelCallbackUrl,
        callbackHttps: airtelCallbackUrl.startsWith("https://"),
        configured: Boolean(
          process.env.AIRTEL_CLIENT_ID
          && process.env.AIRTEL_CLIENT_SECRET
          && process.env.AIRTEL_CALLBACK_URL
        ),
      },
      flutterwave: {
        baseUrl: process.env.FLUTTERWAVE_BASE_URL || "https://api.flutterwave.com",
        redirectUrl: flutterwaveRedirectUrl,
        paymentOptions: process.env.FLUTTERWAVE_PAYMENT_OPTIONS || "mpesa,card,mobilemoneyairtel",
        secretKeyMasked: maskValue(process.env.FLUTTERWAVE_SECRET_KEY || "", { start: 4, end: 4 }),
        webhookHashSet: Boolean(process.env.FLUTTERWAVE_WEBHOOK_HASH),
        configured: Boolean(process.env.FLUTTERWAVE_SECRET_KEY),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to read payment routing summary.", error: error.message });
  }
};

exports.getPublicPaymentReadiness = async (_req, res) => {
  try {
    const mpesaReadiness = getMpesaReadiness();
    const checks = [...mpesaReadiness.checks];

    if (mpesaReadiness.configured && !mpesaReadiness.simulationEnabled) {
      try {
        const mpesa = getMpesaConfig();
        await getMpesaAccessToken(mpesa.baseUrl, mpesa.consumerKey, mpesa.consumerSecret);
        checks.push({ key: "tokenReachable", pass: true, message: "Gateway token request succeeded" });
      } catch (error) {
        checks.push({
          key: "tokenReachable",
          pass: false,
          message: `Gateway token request failed: ${error.message}`,
        });
      }
    }

    return res.status(200).json({
      mpesa: {
        env: mpesaReadiness.env,
        nodeEnv: mpesaReadiness.nodeEnv,
        callbackHttps: mpesaReadiness.callbackHttps,
        configured: mpesaReadiness.configured,
        simulationEnabled: mpesaReadiness.simulationEnabled,
        simulationForcedOffInProduction: mpesaReadiness.simulationForcedOffInProduction,
        checks,
        readyLiveCharge: checks.every((item) => item.pass),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to read payment readiness.", error: error.message });
  }
};

exports.createContribution = async (req, res) => {
  try {
    const {
      amount,
      currency = "USD",
      firstName,
      lastName,
      email,
      paymentGateway,
      mobileProvider,
      donorPhoneNumber,
      mobileTransactionCode,
      mobileChargeRequestId,
    } = req.body;

    const normalizedChargeRequestId = String(mobileChargeRequestId || "").trim();
    const normalizedMobileTransactionCode = String(mobileTransactionCode || "").trim().toUpperCase();

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "A valid contribution amount is required." });
    }

    if (!firstName || !lastName || !email || !paymentGateway) {
      return res.status(400).json({ message: "Donor profile and gateway fields are required." });
    }

    if (paymentGateway === "mobile-money") {
      if (!donorPhoneNumber) {
        return res.status(400).json({ message: "Mobile money number is required." });
      }

      if (!["mpesa", "airtel-money"].includes(String(mobileProvider))) {
        return res.status(400).json({ message: "Select M-Pesa or Airtel Money." });
      }

      if (!mobileTransactionCode) {
        // Optional when webhook callback supplies provider reference automatically.
      }

      if (!normalizedChargeRequestId) {
        return res.status(400).json({ message: "Send Money must be initiated before submitting the contribution." });
      }
    }

    const issuedAt = new Date().toISOString();
    const transactionId = buildTransactionId();

    const contributionPayload = {
      transactionId,
      status: paymentGateway === "mobile-money" ? "pending" : "received",
      issuedAt,
      amount: numericAmount,
      currency,
      paymentGateway,
      mobileProvider: paymentGateway === "mobile-money" ? String(mobileProvider) : undefined,
      mobileChargeRequestId: paymentGateway === "mobile-money" ? normalizedChargeRequestId : undefined,
      mobileTransactionCode: paymentGateway === "mobile-money" && normalizedMobileTransactionCode
        ? normalizedMobileTransactionCode
        : undefined,
      donor: {
        firstName,
        lastName,
        email,
        phoneNumber: paymentGateway === "mobile-money" ? String(donorPhoneNumber).trim() : undefined,
      },
      allocation: {
        seedCapital: Number((numericAmount * allocationRules.seedCapital).toFixed(2)),
        hardware: Number((numericAmount * allocationRules.hardware).toFixed(2)),
        audits: Number((numericAmount * allocationRules.audits).toFixed(2)),
      },
      auditTrail: {
        model: "100% direct impact revolving model",
        encryption: "256-bit transport security",
        statement: "Contribution event captured for receipt and compliance trace.",
      },
    };

    const savedContribution = await Donation.create(contributionPayload);

    return res.status(201).json({
      message: "Contribution captured successfully.",
      contribution: savedContribution,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process contribution.", error: error.message });
  }
};

exports.getContributions = async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key." });
    }

    const maxLimit = 200;
    const requestedLimit = Number(req.query.limit) || 50;
    const limit = Math.min(Math.max(requestedLimit, 1), maxLimit);

    const contributions = await Donation.find().sort({ createdAt: -1 }).limit(limit);

    return res.status(200).json({
      count: contributions.length,
      contributions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch contributions.", error: error.message });
  }
};

exports.getDonationConfig = async (_req, res) => {
  return res.status(200).json(donationConfig);
};

exports.handleMobileMoneyCallback = async (req, res) => {
  try {
    const manualCodeRaw = String(req.body?.mpesaCode || req.body?.mobileTransactionCode || "").trim().toUpperCase();
    const manualPhoneRaw = String(req.body?.senderPhone || req.body?.phoneNumber || "").trim();
    const manualAmount = Number(req.body?.amount);

    // Manual direct-pay flow: donor submits proof of payment for admin verification.
    if (manualCodeRaw || manualPhoneRaw || Number.isFinite(manualAmount)) {
      const normalizedManualPhone = normalizeManualPhoneNumber(manualPhoneRaw);
      const requesterIp = String(req.ip || req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
      const limiterKey = `${requesterIp}:${normalizedManualPhone || manualPhoneRaw || "unknown"}`;
      const limiterResult = consumeManualReceiptAttempt(limiterKey);

      if (limiterResult.limited) {
        return res.status(429).json({
          success: false,
          message: "Too many receipt submissions. Please wait a few minutes before trying again.",
          remainingAttempts: limiterResult.remainingAttempts,
          retryAfterSeconds: limiterResult.retryAfterSeconds,
        });
      }

      if (!manualAmount || manualAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "A valid donated amount is required.",
          remainingAttempts: limiterResult.remainingAttempts,
        });
      }

      if (!manualPhoneRaw || !normalizedManualPhone) {
        return res.status(400).json({
          success: false,
          message: "Sender phone number is required.",
          remainingAttempts: limiterResult.remainingAttempts,
        });
      }

      if (!manualCodeRaw || !manualMpesaCodePattern.test(manualCodeRaw)) {
        return res.status(400).json({
          success: false,
          message: "Invalid M-Pesa code format. Use 10 uppercase letters/numbers starting with a letter.",
          remainingAttempts: limiterResult.remainingAttempts,
        });
      }

      const existing = await Donation.findOne({ mobileTransactionCode: manualCodeRaw });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "This transaction code has already been uploaded for processing.",
          remainingAttempts: limiterResult.remainingAttempts,
        });
      }

      const firstName = String(req.body?.firstName || "Manual").trim() || "Manual";
      const lastName = String(req.body?.lastName || "Donor").trim() || "Donor";
      const email = String(req.body?.email || "manual-donor@sseyc.local").trim().toLowerCase() || "manual-donor@sseyc.local";
      const provider = String(req.body?.provider || "mpesa").trim();

      const newRecord = await Donation.create({
        transactionId: buildManualTransactionId(),
        status: "pending",
        issuedAt: new Date().toISOString(),
        amount: manualAmount,
        currency: String(req.body?.currency || "KES").trim().toUpperCase(),
        paymentGateway: "mobile-money",
        mobileProvider: provider === "airtel-money" ? "airtel-money" : "mpesa",
        mobileTransactionCode: manualCodeRaw,
        donor: {
          firstName,
          lastName,
          email,
          phoneNumber: normalizedManualPhone,
        },
        allocation: {
          seedCapital: Number((manualAmount * allocationRules.seedCapital).toFixed(2)),
          hardware: Number((manualAmount * allocationRules.hardware).toFixed(2)),
          audits: Number((manualAmount * allocationRules.audits).toFixed(2)),
        },
        auditTrail: {
          model: "100% direct impact revolving model",
          encryption: "256-bit transport security",
          statement: "Manual direct-pay receipt submitted. Pending administrative verification.",
        },
      });

      return res.status(201).json({
        success: true,
        message: "Receipt submitted successfully! Your donation is marked as pending admin verification.",
        recordId: newRecord._id,
        transactionId: newRecord.transactionId,
        remainingAttempts: limiterResult.remainingAttempts,
      });
    }

    const mpesa = parseMpesaCallback(req.body);
    const airtel = mpesa ? null : parseAirtelCallback(req.body);
    const callback = mpesa || airtel;

    if (!callback || !callback.requestId) {
      return res.status(200).json({ resultCode: 0, resultDesc: "Accepted" });
    }

    const donation = await Donation.findOne({ mobileChargeRequestId: callback.requestId });
    if (!donation) {
      return res.status(200).json({ resultCode: 0, resultDesc: "Accepted" });
    }

    if (callback.success) {
      donation.status = "received";
      if (!donation.mobileTransactionCode && callback.receipt) {
        donation.mobileTransactionCode = String(callback.receipt).trim().toUpperCase();
      }
    } else if (callback.provider === "mpesa" || callback.knownFailure) {
      donation.status = "failed";
    }

    if (donation.auditTrail?.statement) {
      const eventText = ` Payment callback ${callback.provider} code ${callback.resultCode}: ${callback.resultDesc}`;
      donation.auditTrail.statement = `${donation.auditTrail.statement}${eventText}`.slice(0, 800);
    }

    await donation.save();

    return res.status(200).json({ resultCode: 0, resultDesc: "Accepted" });
  } catch (_error) {
    return res.status(200).json({ resultCode: 0, resultDesc: "Accepted" });
  }
};

exports.getPendingManualContributions = async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key." });
    }

    const records = await Donation.find({ status: "pending", paymentGateway: "mobile-money" }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch pending manual records.", error: error.message });
  }
};

exports.verifyManualContribution = async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key." });
    }

    const { id } = req.params;
    const record = await Donation.findById(id);

    if (!record) {
      return res.status(404).json({ success: false, message: "Donation record not found." });
    }

    record.status = "received";
    if (record.auditTrail?.statement) {
      const next = `${record.auditTrail.statement} Admin verification completed.`;
      record.auditTrail.statement = next.slice(0, 800);
    }

    await record.save();
    return res.status(200).json({ success: true, record });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Status transformation runtime failure.", error: error.message });
  }
};

exports.updateDonationConfig = async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ message: "Unauthorized: invalid admin key." });
    }

    const { hero, monthlyPrograms, oneTimeTiers } = req.body;

    if (!hero || typeof hero.headline !== "string" || typeof hero.subheadline !== "string") {
      return res.status(400).json({ message: "Hero headline and subheadline are required." });
    }

    if (!Array.isArray(monthlyPrograms) || monthlyPrograms.length === 0) {
      return res.status(400).json({ message: "At least one monthly program is required." });
    }

    if (!Array.isArray(oneTimeTiers) || oneTimeTiers.length === 0) {
      return res.status(400).json({ message: "At least one one-time tier is required." });
    }

    const normalizedPrograms = monthlyPrograms
      .map((program, index) => ({
        key: String(program.key || `program-${index + 1}`).trim(),
        title: String(program.title || "").trim(),
        summary: String(program.summary || "").trim(),
        amount: Number(program.amount),
      }))
      .filter((program) => program.title && program.summary && Number.isFinite(program.amount) && program.amount > 0);

    if (!normalizedPrograms.length) {
      return res.status(400).json({ message: "Monthly programs must include title, summary, and valid amount." });
    }

    const normalizedTiers = oneTimeTiers
      .map((tier) => Number(tier))
      .filter((tier) => Number.isFinite(tier) && tier > 0);

    if (!normalizedTiers.length) {
      return res.status(400).json({ message: "One-time tiers must contain valid positive amounts." });
    }

    donationConfig.hero = {
      headline: hero.headline.trim(),
      subheadline: hero.subheadline.trim(),
    };
    donationConfig.monthlyPrograms = normalizedPrograms;
    donationConfig.oneTimeTiers = normalizedTiers;

    return res.status(200).json({
      message: "Donation configuration updated successfully.",
      config: donationConfig,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update donation configuration.", error: error.message });
  }
};

