import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

const defaultMonthlyImpactPrograms = [
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
];

const defaultOneTimeTiers = [50, 250, 500, 1500];

const impactMatrix = [
  {
    amount: "$50",
    destination: "Track Toolkits",
    outcome: "Equips 1 Fashion graduate with a startup toolkit or tailoring shears.",
  },
  {
    amount: "$250",
    destination: "Individual Seed Loan",
    outcome: "Fully capitalizes 1 graduate micro-loan to launch an independent local business.",
  },
  {
    amount: "$500",
    destination: "Group Venture Accelerator",
    outcome: "Provides a combined seed loan for 2 to 3 youth in clean-energy or agriculture.",
  },
  {
    amount: "$1,500",
    destination: "Hub Workshop Machinery",
    outcome: "Finances industrial machinery or multi-workstation development equipment.",
  },
];

const allocationRules = [
  {
    label: "Direct Revolving Seed Capital",
    percent: 80,
    summary: "Loan allocations disbursed directly to youth graduates.",
    tone: "bg-ocean",
  },
  {
    label: "Hardware & Facility Upgrades",
    percent: 15,
    summary: "Upkeep of computer labs, tailoring workshops, and hub machinery.",
    tone: "bg-sunrise",
  },
  {
    label: "Program M&E and Audits",
    percent: 5,
    summary: "Data tracking, accountability reporting, and financial audits.",
    tone: "bg-mint",
  },
];

const trustBadges = [
  "256-Bit Secure Encryption",
  "Audited Financial Statements",
  "100% Direct Impact Model",
];
const currencyOptions = [
  { code: "USD", name: "US Dollar" },
  { code: "KSH", name: "Kenyan Shilling" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "ZAR", name: "South African Rand" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "ZWL", name: "Zimbabwean Dollar" },
];
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const mobileMoneyPayNumber = import.meta.env.VITE_MOBILE_MONEY_NUMBER || "0798406723";

const normalizeSmsRecipient = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  return digits;
};

const buildSmsHref = (recipient, body) => {
  const number = normalizeSmsRecipient(recipient);
  if (!number) return "#";

  const hasBody = String(body || "").trim().length > 0;
  if (!hasBody) return `sms:${number}`;

  const isIOS = /iPad|iPhone|iPod/i.test(typeof navigator !== "undefined" ? navigator.userAgent : "");
  const separator = isIOS ? "&" : "?";
  return `sms:${number}${separator}body=${encodeURIComponent(body)}`;
};

const mobileMoneyDialNumber = normalizeSmsRecipient(mobileMoneyPayNumber);

function getImpactCopy(amount) {
  if (!amount || amount <= 0) {
    return "Select a tier or enter a custom amount to preview your exact impact pathway.";
  }
  if (amount < 100) {
    return "You are equipping practical startup toolkits for youth entering market-facing tracks.";
  }
  if (amount < 350) {
    return "You are about to launch 1 complete youth startup loan business cycle.";
  }
  if (amount < 1000) {
    return "You are catalyzing a collaborative youth venture with capital runway and mentorship support.";
  }
  return "You are funding strategic hub capacity and revolving capital that compounds impact across cohorts.";
}

function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [amountInput, setAmountInput] = useState("250");
  const [donationFrequency, setDonationFrequency] = useState("monthly");
  const [monthlyImpactPrograms, setMonthlyImpactPrograms] = useState(defaultMonthlyImpactPrograms);
  const [oneTimeTiers, setOneTimeTiers] = useState(defaultOneTimeTiers);
  const [heroContent, setHeroContent] = useState({
    headline: "Capitalize the Future: Expand the SSEY-C Revolving Fund",
    subheadline:
      "100% of your contribution directly funds youth seed loans and critical workshop machinery. Because our fund is revolving, your capital is repaid, recycled, and reinvested to empower generation after generation of young African entrepreneurs.",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [paymentGate, setPaymentGate] = useState("mobile-money");
  const [mobileProvider, setMobileProvider] = useState("mpesa");
  const [donorMobileNumber, setDonorMobileNumber] = useState("");
  const [mpesaPin, setMpesaPin] = useState("");
  const [mobileTransactionCode, setMobileTransactionCode] = useState("");
  const [isSendingMobileMoney, setIsSendingMobileMoney] = useState(false);
  const [mobileChargeRequestId, setMobileChargeRequestId] = useState("");
  const [mobileChargeMessage, setMobileChargeMessage] = useState("");
  const [smsHelperMessage, setSmsHelperMessage] = useState("");
  const [mpesaReadiness, setMpesaReadiness] = useState({
    loading: true,
    configured: false,
    callbackHttps: false,
    simulationEnabled: false,
    simulationForcedOffInProduction: false,
    readyLiveCharge: false,
    checks: [],
    error: "",
  });
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDonateConfig = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/donations/config`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || "Failed to load donation config.");
        }

        if (!isMounted) return;

        const monthlyPrograms = Array.isArray(payload.monthlyPrograms) && payload.monthlyPrograms.length
          ? payload.monthlyPrograms
          : defaultMonthlyImpactPrograms;
        const normalizedMonthlyPrograms = monthlyPrograms.some((program) => Number(program?.amount) === 500)
          ? monthlyPrograms
          : [
              ...monthlyPrograms,
              {
                key: "venture-scale-up",
                title: "Venture Scale-Up",
                amount: 500,
                summary: "can scale an existing youth venture with equipment and working capital.",
              },
            ];
        const oneTime = Array.isArray(payload.oneTimeTiers) && payload.oneTimeTiers.length
          ? payload.oneTimeTiers
          : defaultOneTimeTiers;

        setMonthlyImpactPrograms(normalizedMonthlyPrograms);
        setOneTimeTiers(oneTime);

        if (payload.hero?.headline && payload.hero?.subheadline) {
          setHeroContent(payload.hero);
        }
      } catch (_error) {
      }
    };

    loadDonateConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPaymentReadiness = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/donations/payment-readiness`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || "Failed to load payment readiness.");
        }

        if (!isMounted) return;
        const mpesa = payload?.mpesa || {};
        setMpesaReadiness({
          loading: false,
          configured: Boolean(mpesa.configured),
          callbackHttps: Boolean(mpesa.callbackHttps),
          simulationEnabled: Boolean(mpesa.simulationEnabled),
          simulationForcedOffInProduction: Boolean(mpesa.simulationForcedOffInProduction),
          readyLiveCharge: Boolean(mpesa.readyLiveCharge),
          checks: Array.isArray(mpesa.checks) ? mpesa.checks : [],
          error: "",
        });
      } catch (error) {
        if (!isMounted) return;
        setMpesaReadiness((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Unable to verify M-Pesa readiness.",
        }));
      }
    };

    loadPaymentReadiness();

    return () => {
      isMounted = false;
    };
  }, []);

  const numericAmount = useMemo(() => {
    const parsed = Number(amountInput);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [amountInput]);

  const impactCopy = useMemo(() => getImpactCopy(numericAmount), [numericAmount]);
  const monthlyPresetTiers = useMemo(
    () => monthlyImpactPrograms.map((item) => Number(item.amount)).filter((value) => Number.isFinite(value) && value > 0),
    [monthlyImpactPrograms]
  );

  const activePresetTiers = donationFrequency === "monthly" ? monthlyPresetTiers : oneTimeTiers;
  const smsPrefillMessage = `Hello, I am sending a donation of ${currency} ${numericAmount || ""} to SSEY-C receiver ${mobileMoneyDialNumber}.`;
  const donorSmsNumber = normalizeSmsRecipient(donorMobileNumber);
  const transactionCodeHint = mobileTransactionCode.trim().toUpperCase() || "PASTE_MPESA_CODE";
  const donorSmsPrefillMessage = `SSEY-C donation reminder: send ${currency} ${numericAmount || ""} to ${mobileMoneyDialNumber}, then paste transaction code ${transactionCodeHint} in the form.`;
  const normalizedTransactionCode = mobileTransactionCode.trim().toUpperCase();
  const hasTransactionCodeInput = normalizedTransactionCode.length > 0;
  const isTransactionCodeValid = /^[A-Z][A-Z0-9]{9}$/.test(normalizedTransactionCode);
  const hasMpesaPinInput = mpesaPin.trim().length > 0;
  const isMpesaPinValid = /^\d{4}$/.test(mpesaPin.trim());
  const canSendMpesa = mpesaReadiness.readyLiveCharge || mpesaReadiness.simulationEnabled;

  const handleTierSelect = (amount) => {
    setSelectedAmount(amount);
    setAmountInput(String(amount));
  };

  const handleFrequencyChange = (frequency) => {
    setDonationFrequency(frequency);
    const nextTiers = frequency === "monthly" ? monthlyPresetTiers : oneTimeTiers;
    const fallback = nextTiers[1] || nextTiers[0] || 50;

    if (!nextTiers.includes(Number(amountInput))) {
      setSelectedAmount(fallback);
      setAmountInput(String(fallback));
    }
  };

  const handleCustomAmount = (event) => {
    const nextValue = event.target.value;
    setAmountInput(nextValue);
    const parsed = Number(nextValue);
    setSelectedAmount(activePresetTiers.includes(parsed) ? parsed : null);
  };

  const handleSendMobileMoney = async () => {
    setSubmitError("");
    setMobileChargeMessage("");

    if (paymentGate !== "mobile-money") {
      setSubmitError("Select Mobile Money first.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setSubmitError("Set a valid amount before sending mobile money request.");
      return;
    }

    if (!donorMobileNumber.trim()) {
      setSubmitError("Enter your mobile money number before sending request.");
      return;
    }

    if (mobileProvider === "mpesa" && !isMpesaPinValid) {
      setSubmitError("Enter your 4-digit M-Pesa PIN before sending money.");
      return;
    }

    if (mobileProvider === "mpesa" && !canSendMpesa) {
      setSubmitError("Live M-Pesa is not ready yet. Complete all readiness checks first.");
      return;
    }

    setIsSendingMobileMoney(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/donations/mobile-money/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: mobileProvider,
          amount: numericAmount,
          phoneNumber: donorMobileNumber.trim(),
          pin: mobileProvider === "mpesa" ? mpesaPin.trim() : undefined,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        const details = payload?.error ? ` (${payload.error})` : "";
        throw new Error(`${payload.message || "Failed to send mobile money prompt."}${details}`);
      }

      setMobileChargeRequestId(payload.checkoutRequestId || "");
      setMobileChargeMessage(payload.customerMessage || payload.message || "Prompt sent to your phone.");
      if (mobileProvider === "mpesa") {
        setMpesaPin("");
      }
    } catch (error) {
      const isNetworkFailure = !error?.message || String(error.message).toLowerCase().includes("failed to fetch");
      setSubmitError(
        isNetworkFailure
          ? "Payment server is unreachable. Make sure backend is running, then try again."
          : error.message
      );
    } finally {
      setIsSendingMobileMoney(false);
    }
  };

  const handleCopyText = async (value, successMessage) => {
    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard is unavailable on this browser.");
      }
      await navigator.clipboard.writeText(value);
      setSmsHelperMessage(successMessage);
    } catch (_error) {
      setSmsHelperMessage("Copy failed. Please long-press and copy manually.");
    }
  };

  const downloadReceiptPdf = (receipt) => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const left = 56;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("SSEY-C Contribution Receipt", left, 72);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`Receipt Issued: ${new Date(receipt.issuedAt).toLocaleString()}`, left, 98);
    pdf.text(`Transaction ID: ${receipt.transactionId}`, left, 116);
    pdf.text(`Status: ${receipt.status.toUpperCase()}`, left, 134);

    pdf.setFont("helvetica", "bold");
    pdf.text("Donor Details", left, 170);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${receipt.donor.firstName} ${receipt.donor.lastName}`, left, 190);
    pdf.text(`${receipt.donor.email}`, left, 208);

    pdf.setFont("helvetica", "bold");
    pdf.text("Contribution", left, 246);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Amount: ${receipt.currency} ${receipt.amount.toLocaleString()}`, left, 266);
    pdf.text(`Gateway: ${receipt.paymentGateway}`, left, 284);

    pdf.setFont("helvetica", "bold");
    pdf.text("Fund Allocation", left, 322);
    pdf.setFont("helvetica", "normal");
    pdf.text(`80% Direct Revolving Seed Capital: ${receipt.currency} ${receipt.allocation.seedCapital.toLocaleString()}`, left, 342);
    pdf.text(`15% Hardware and Facility Upgrades: ${receipt.currency} ${receipt.allocation.hardware.toLocaleString()}`, left, 360);
    pdf.text(`5% Program M&E and Audits: ${receipt.currency} ${receipt.allocation.audits.toLocaleString()}`, left, 378);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.text("This receipt is generated automatically for tax, grant, and compliance reporting.", left, 730);

    pdf.save(`SSEYC-Receipt-${receipt.transactionId}.pdf`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setMobileChargeMessage("");

    if (!numericAmount || numericAmount <= 0) {
      setSubmitError("Please choose or enter a valid contribution amount.");
      return;
    }

    if (["mobile-money", "hosted-checkout"].includes(paymentGate) && !donorMobileNumber.trim()) {
      setSubmitError("Please enter your M-Pesa or Airtel Money phone number.");
      return;
    }

    if (paymentGate === "hosted-checkout") {
      setIsSubmitting(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/payments/initialize-checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            phone: donorMobileNumber.trim(),
            amount: numericAmount,
            currency,
            firstName,
            lastName,
          }),
        });

        const payload = await response.json();
        if (!response.ok || !payload?.success || !payload?.checkoutUrl) {
          throw new Error(payload?.message || "Payment initialization failed.");
        }

        window.location.href = payload.checkoutUrl;
        return;
      } catch (error) {
        setSubmitError(error.message || "Network failure connecting to the secure payment node.");
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (paymentGate === "mobile-money" && mobileTransactionCode.trim().length !== 10) {
      setSubmitError("Invalid M-Pesa code layout. Must be exactly 10 characters.");
      return;
    }

    if (paymentGate === "mobile-money") {
      setIsSubmitting(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/donations/mobile-money/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderPhone: donorMobileNumber.trim(),
            mpesaCode: mobileTransactionCode.trim().toUpperCase(),
            amount: numericAmount,
            currency,
            firstName,
            lastName,
            email,
            provider: mobileProvider,
          }),
        });

        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          const errorBase = payload?.message || "Submission failed.";
          const attemptsHint = Number.isFinite(Number(payload?.remainingAttempts))
            ? ` Attempts left: ${Number(payload.remainingAttempts)}.`
            : "";
          const retryHint = Number.isFinite(Number(payload?.retryAfterSeconds)) && Number(payload.retryAfterSeconds) > 0
            ? ` Retry in about ${Math.ceil(Number(payload.retryAfterSeconds) / 60)} min.`
            : "";
          throw new Error(`${errorBase}${attemptsHint}${retryHint}`.trim());
        }

        const successBase = payload.message || "Receipt submitted successfully! Pending admin verification.";
        const attemptsHint = Number.isFinite(Number(payload?.remainingAttempts))
          ? ` Attempts left in this window: ${Number(payload.remainingAttempts)}.`
          : "";
        setMobileChargeMessage(`${successBase}${attemptsHint}`.trim());
        setMobileChargeRequestId(payload.transactionId || "");
        setMobileTransactionCode("");
      } catch (error) {
        setSubmitError(error.message || "Network failure communicating with your ngrok proxy.");
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/donations/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          currency: currency,
          frequency: donationFrequency,
          firstName,
          lastName,
          email,
          paymentGateway: paymentGate,
          mobileProvider: paymentGate === "mobile-money" ? mobileProvider : undefined,
          donorPhoneNumber: paymentGate === "mobile-money" ? donorMobileNumber.trim() : undefined,
          mobileChargeRequestId: paymentGate === "mobile-money" ? mobileChargeRequestId : undefined,
          mobileTransactionCode: paymentGate === "mobile-money" ? mobileTransactionCode.trim().toUpperCase() : undefined,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Unable to process contribution right now.");
      }

      setSubmittedReceipt(payload.contribution);
      downloadReceiptPdf(payload.contribution);
    } catch (error) {
      setSubmitError(error.message || "Failed to process contribution.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-sand pb-20 pt-14 dark:bg-slate-950 sm:pt-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-ocean/15 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Donate / Fund Capitalization</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl lg:text-5xl">
            {heroContent.headline}
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-ink/75 dark:text-slate-300 sm:text-base">
            {heroContent.subheadline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {trustBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-ocean/20 bg-sand px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-mint">
                {badge}
              </span>
            ))}
          </div>

          <a
            href="#donation-portal"
            className="mt-7 inline-flex items-center rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90"
          >
            Donate Now
          </a>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {monthlyImpactPrograms.map((program) => (
            <article key={program.key || program.title} className="rounded-2xl border border-ocean/15 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">{program.title}</p>
              <p className="mt-2 text-base leading-relaxed text-ink/80 dark:text-slate-300">
                <span className="font-extrabold text-ocean dark:text-mint">${program.amount}</span> {program.summary}
              </p>
              <button
                type="button"
                onClick={() => {
                  handleFrequencyChange("monthly");
                  handleTierSelect(program.amount);
                  const portal = document.getElementById("donation-portal");
                  portal?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="mt-5 inline-flex items-center rounded-xl bg-sunrise px-5 py-3 text-sm font-bold text-ink transition hover:bg-sunrise/90"
              >
                Give ${program.amount}/month
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-ocean/15 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-ocean/10 px-6 py-6 dark:border-slate-700 sm:px-8">
            <h2 className="font-display text-2xl font-extrabold text-ink dark:text-slate-100 sm:text-3xl">Transparent Gift Impact Matrix</h2>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {impactMatrix.map((item) => (
              <article key={item.amount} className="rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-2xl font-extrabold text-ocean dark:text-mint">{item.amount}</p>
                <p className="mt-2 text-sm font-bold text-ink dark:text-slate-100">{item.destination}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75 dark:text-slate-300">{item.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <article className="rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Financial Transparency Blueprint</p>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-ink dark:text-slate-100">Where the Money Goes</h3>
            <div className="mt-6 space-y-5">
              {allocationRules.map((rule) => (
                <div key={rule.label}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-ink dark:text-slate-100">{rule.label}</p>
                    <p className="text-sm font-extrabold text-ocean dark:text-mint">{rule.percent}%</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className={`h-full rounded-full ${rule.tone}`} style={{ width: `${rule.percent}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">{rule.summary}</p>
                </div>
              ))}
            </div>
          </article>

          <article id="donation-portal" className="rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h3 className="font-display text-2xl font-extrabold text-ink dark:text-slate-100">Why Financial Backing Matters</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-slate-300">
                  Traditional commercial banks often reject young graduates due to lack of collateral. By backing SSEY-C, you provide the
                  runway youth need to become self-sufficient business leaders.
                </p>
                <div className="mt-5 rounded-2xl border border-mint/30 bg-mint/15 p-4 text-sm leading-relaxed text-ocean dark:border-mint/20 dark:bg-mint/10 dark:text-mint">
                  <span className="font-bold">The Revolving Power:</span> when a graduate repays their startup loan, those same funds are
                  immediately redeployed to the next student business cycle.
                </div>
                <div className="mt-5 rounded-2xl border border-ocean/15 bg-sand p-4 text-sm font-semibold text-ink/85 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {impactCopy}
                </div>
              </div>

              <div className="lg:col-span-7">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-ink/70 dark:text-slate-300">
                      Frequency
                    </label>
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      {[
                        { key: "monthly", label: "Monthly" },
                        { key: "one-time", label: "One-Time" },
                      ].map((mode) => {
                        const isActive = donationFrequency === mode.key;
                        return (
                          <button
                            key={mode.key}
                            type="button"
                            onClick={() => handleFrequencyChange(mode.key)}
                            className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                              isActive
                                ? "border-ocean bg-ocean/10 text-ocean dark:border-mint dark:bg-mint/15 dark:text-mint"
                                : "border-slate-300 bg-white text-ink hover:border-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-mint"
                            }`}
                          >
                            {mode.label}
                          </button>
                        );
                      })}
                    </div>

                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-ink/70 dark:text-slate-300">
                      1. Select Capital Contribution
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {activePresetTiers.map((tier) => {
                        const isActive = selectedAmount === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => handleTierSelect(tier)}
                            className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${
                              isActive
                                ? "border-ocean bg-ocean/10 text-ocean dark:border-mint dark:bg-mint/15 dark:text-mint"
                                : "border-slate-300 bg-white text-ink hover:border-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-mint"
                            }`}
                          >
                            ${tier.toLocaleString()}
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative mt-3 flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          value={amountInput}
                          onChange={handleCustomAmount}
                          placeholder="Amount"
                          className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                        />
                      </div>
                      <div className="relative w-24 shrink-0">
                        <button
                          type="button"
                          onClick={() => { setCurrencyDropdownOpen(!currencyDropdownOpen); setCurrencySearch(""); }}
                          className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink transition hover:border-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-mint"
                        >
                          <span>{currency}</span>
                          <svg
                            className={`ml-1 h-3.5 w-3.5 transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {currencyDropdownOpen && (() => {
                          const q = currencySearch.trim().toUpperCase();
                          const filtered = currencyOptions.filter(
                            (c) => c.code.includes(q) || c.name.toUpperCase().includes(q)
                          );
                          const isCustom = q.length > 0 && !currencyOptions.some((c) => c.code === q);
                          return (
                            <div className="absolute left-0 top-full z-50 mt-2 w-[280px] max-h-64 overflow-y-auto rounded-xl border border-slate-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
                              <div className="sticky top-0 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                                <input
                                  autoFocus
                                  type="text"
                                  placeholder="Search any currency..."
                                  value={currencySearch}
                                  onChange={(e) => setCurrencySearch(e.target.value)}
                                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ocean dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-mint"
                                />
                              </div>
                              {isCustom && (
                                <button
                                  type="button"
                                  onClick={() => { setCurrency(q); setCurrencyDropdownOpen(false); setCurrencySearch(""); }}
                                  className="w-full px-4 py-3 text-left text-sm font-semibold text-ocean transition hover:bg-ocean/10 dark:text-mint dark:hover:bg-mint/10"
                                >
                                  Use <span className="font-bold">{q}</span> <span className="text-ink/50 dark:text-slate-400">— custom currency</span>
                                </button>
                              )}
                              {filtered.length === 0 && !isCustom && (
                                <p className="px-4 py-3 text-sm text-ink/50 dark:text-slate-400">No results. Keep typing to use custom code.</p>
                              )}
                              {filtered.map((curr) => (
                                <button
                                  key={curr.code}
                                  type="button"
                                  onClick={() => { setCurrency(curr.code); setCurrencyDropdownOpen(false); setCurrencySearch(""); }}
                                  className={`w-full px-4 py-3 text-left text-sm font-semibold transition hover:bg-ocean/10 dark:hover:bg-mint/10 ${
                                    currency === curr.code
                                      ? "border-l-4 border-ocean bg-ocean/5 text-ocean dark:border-mint dark:bg-mint/5 dark:text-mint"
                                      : "text-ink dark:text-slate-100"
                                  }`}
                                >
                                  <span className="font-bold">{curr.code}</span>
                                  <span className="ml-2 text-ink/60 dark:text-slate-400">{curr.name}</span>
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-[0.18em] text-ink/70 dark:text-slate-300">
                      2. Donor Identification
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        required
                        placeholder="First Name"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        required
                        placeholder="Last Name"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                      />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="Email Address for Tax Receipt"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-ink/70 dark:text-slate-300">
                      3. Preferred Gateway
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        { key: "hosted-checkout", label: "M-Pesa / Airtel / Card" },
                        { key: "mobile-money", label: "Mobile Money" },
                        { key: "bank-wire", label: "Bank Wire / EFT" },
                      ].map((gateway) => {
                        const isActive = paymentGate === gateway.key;
                        return (
                          <label
                            key={gateway.key}
                            className={`cursor-pointer rounded-xl border p-3 text-center text-xs font-bold transition ${
                              isActive
                                ? "border-ocean bg-ocean/10 text-ocean dark:border-mint dark:bg-mint/15 dark:text-mint"
                                : "border-slate-300 bg-white text-ink/80 hover:border-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-mint"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-gate"
                              value={gateway.key}
                              checked={isActive}
                              onChange={(event) => setPaymentGate(event.target.value)}
                              className="sr-only"
                            />
                            {gateway.label}
                          </label>
                        );
                      })}
                    </div>

                    {paymentGate === "hosted-checkout" && (
                      <div className="mt-4 rounded-2xl border border-ocean/25 bg-ocean/5 p-4 dark:border-mint/25 dark:bg-mint/10">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean dark:text-mint">Secure Hosted Checkout</p>
                        <p className="mt-1 text-sm text-ink/75 dark:text-slate-300">
                          Supports M-Pesa STK Push, Airtel Money, Visa, and Mastercard through a verified payment gateway.
                        </p>
                        <label className="mt-3 block text-xs font-bold uppercase tracking-[0.15em] text-ink/70 dark:text-slate-300">
                          Mobile Number (for M-Pesa or Airtel prompt)
                        </label>
                        <input
                          type="tel"
                          value={donorMobileNumber}
                          onChange={(event) => setDonorMobileNumber(event.target.value)}
                          placeholder="e.g. 254712345678"
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                        />
                      </div>
                    )}

                    {paymentGate === "mobile-money" && (
                      <div className="mt-4 rounded-2xl border border-mint/35 bg-mint/10 p-4 dark:border-mint/25 dark:bg-mint/10">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean dark:text-mint">Manual Direct-Pay Option</p>
                        <div className="mt-2 rounded-xl border border-ocean/20 bg-ocean/5 px-3 py-3 dark:border-mint/25 dark:bg-mint/10">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean dark:text-mint">Step 1: Send Funds Manually</p>
                          <p className="mt-1 text-xs text-ink/70 dark:text-slate-300">
                            Open M-Pesa Send Money and transfer to this receiver wallet number.
                          </p>
                          <p className="mt-1 text-base font-extrabold text-ocean dark:text-mint">{mobileMoneyPayNumber}</p>
                        </div>
                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {[
                            { key: "mpesa", label: "M-Pesa" },
                            { key: "airtel-money", label: "Airtel Money" },
                          ].map((provider) => {
                            const isProviderActive = mobileProvider === provider.key;
                            return (
                              <label
                                key={provider.key}
                                className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-xs font-bold transition ${
                                  isProviderActive
                                    ? "border-ocean bg-ocean/10 text-ocean dark:border-mint dark:bg-mint/15 dark:text-mint"
                                    : "border-slate-300 bg-white text-ink/80 hover:border-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-mint"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="mobile-provider"
                                  value={provider.key}
                                  checked={isProviderActive}
                                  onChange={(event) => setMobileProvider(event.target.value)}
                                  className="sr-only"
                                />
                                {provider.label}
                              </label>
                            );
                          })}
                        </div>
                        <label className="mt-3 block text-xs font-bold uppercase tracking-[0.15em] text-ink/70 dark:text-slate-300">
                          Step 2: Your M-Pesa / Airtel Number
                        </label>
                        <input
                          type="tel"
                          value={donorMobileNumber}
                          onChange={(event) => setDonorMobileNumber(event.target.value)}
                          placeholder="e.g. 2547XXXXXXXX"
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                        />
                        {mobileProvider === "mpesa" && (
                          <>
                            <label className="mt-3 block text-xs font-bold uppercase tracking-[0.15em] text-ink/70 dark:text-slate-300">
                              Step 3: Enter M-Pesa PIN
                            </label>
                            <input
                              type="password"
                              inputMode="numeric"
                              value={mpesaPin}
                              onChange={(event) => setMpesaPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
                              maxLength={4}
                              placeholder="4-digit PIN"
                              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                            />
                            {hasMpesaPinInput && (
                              <p
                                className={`mt-1 text-xs font-semibold ${
                                  isMpesaPinValid
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : "text-red-700 dark:text-red-300"
                                }`}
                              >
                                {isMpesaPinValid ? "PIN format is valid." : "PIN must be exactly 4 digits."}
                              </p>
                            )}
                          </>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleSendMobileMoney}
                            disabled={
                              isSendingMobileMoney
                              || !donorSmsNumber
                              || (mobileProvider === "mpesa" && (!isMpesaPinValid || !canSendMpesa || mpesaReadiness.loading))
                            }
                            className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-bold transition ${
                              isSendingMobileMoney || !donorSmsNumber || (mobileProvider === "mpesa" && (!isMpesaPinValid || !canSendMpesa || mpesaReadiness.loading))
                                ? "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                : "bg-ocean text-white hover:bg-ocean/90"
                            }`}
                          >
                            {isSendingMobileMoney ? "Sending Money..." : "Send Money"}
                          </button>
                          <p className="self-center text-xs text-ink/60 dark:text-slate-400">
                            Sends an instant payment prompt to your phone.
                          </p>
                        </div>
                        {mobileProvider === "mpesa" && (
                          <div className="mt-3 rounded-xl border border-ocean/20 bg-ocean/5 px-3 py-3 dark:border-slate-600 dark:bg-slate-800">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean dark:text-mint">Live M-Pesa Readiness</p>
                            {mpesaReadiness.loading && (
                              <p className="mt-1 text-xs text-ink/70 dark:text-slate-300">Checking live payment readiness...</p>
                            )}
                            {!mpesaReadiness.loading && mpesaReadiness.error && (
                              <p className="mt-1 text-xs text-red-700 dark:text-red-300">{mpesaReadiness.error}</p>
                            )}
                            {!mpesaReadiness.loading && !mpesaReadiness.error && (
                              <>
                                <p
                                  className={`mt-1 text-xs font-semibold ${
                                    mpesaReadiness.readyLiveCharge || mpesaReadiness.simulationEnabled
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : "text-red-700 dark:text-red-300"
                                  }`}
                                >
                                  {mpesaReadiness.simulationEnabled
                                    ? "Local simulation active: Send Money will simulate prompt (no real debit)."
                                    : mpesaReadiness.readyLiveCharge
                                    ? "Ready: real M-Pesa debit is enabled."
                                    : "Not ready: complete all checks below to enable real debit."}
                                </p>
                                {mpesaReadiness.simulationForcedOffInProduction && (
                                  <p className="mt-1 text-xs text-ink/70 dark:text-slate-300">
                                    Production safeguard: simulation is forced off.
                                  </p>
                                )}
                                <div className="mt-2 space-y-1">
                                  {mpesaReadiness.checks.map((check) => (
                                    <p
                                      key={check.key}
                                      className={`text-xs ${check.pass ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}
                                    >
                                      {check.pass ? "OK" : "FAIL"}: {check.message}
                                    </p>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={buildSmsHref(mobileMoneyDialNumber, smsPrefillMessage)}
                            className="inline-flex items-center rounded-xl border border-ocean/25 bg-white px-4 py-2 text-xs font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:bg-slate-800 dark:text-mint dark:hover:bg-slate-700"
                          >
                            Open SMS To Receiver
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyText(mobileMoneyPayNumber, "Receiver number copied.")}
                            className="inline-flex items-center rounded-xl border border-ocean/25 bg-white px-4 py-2 text-xs font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:bg-slate-800 dark:text-mint dark:hover:bg-slate-700"
                          >
                            Copy Number
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyText(smsPrefillMessage, "SMS template copied.")}
                            className="inline-flex items-center rounded-xl border border-ocean/25 bg-white px-4 py-2 text-xs font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:bg-slate-800 dark:text-mint dark:hover:bg-slate-700"
                          >
                            Copy SMS Template
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-ink/60 dark:text-slate-400">
                          If Open SMS does not launch on desktop, open this page on your phone browser and tap again.
                        </p>
                        {smsHelperMessage && (
                          <p className="mt-2 rounded-xl border border-ocean/20 bg-ocean/5 px-3 py-2 text-xs font-semibold text-ocean dark:border-mint/25 dark:bg-mint/10 dark:text-mint">
                            {smsHelperMessage}
                          </p>
                        )}
                        {mobileChargeMessage && (
                          <p className="mt-2 rounded-xl border border-mint/30 bg-mint/10 px-3 py-2 text-xs font-semibold text-ocean dark:border-mint/25 dark:bg-mint/10 dark:text-mint">
                            {mobileChargeMessage}
                          </p>
                        )}
                        {mobileChargeRequestId && (
                          <p className="mt-2 text-xs text-ink/65 dark:text-slate-400">
                            Request ID: <span className="font-semibold text-ink dark:text-slate-200">{mobileChargeRequestId}</span>
                          </p>
                        )}
                        <label className="mt-3 block text-xs font-bold uppercase tracking-[0.15em] text-ink/70 dark:text-slate-300">
                          Step 4: M-Pesa Transaction Code
                        </label>
                        <input
                          type="text"
                          value={mobileTransactionCode}
                          onChange={(event) => setMobileTransactionCode(event.target.value.toUpperCase())}
                          maxLength={10}
                          placeholder="e.g. TE45XY78ZZ"
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm uppercase text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                        />
                        {hasTransactionCodeInput && (
                          <p
                            className={`mt-1 text-xs font-semibold ${
                              isTransactionCodeValid
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {isTransactionCodeValid
                              ? "Valid transaction code format."
                              : "Invalid format: use 10 uppercase letters/numbers starting with a letter."}
                          </p>
                        )}
                        <p className="mt-2 text-xs font-semibold text-ink/70 dark:text-slate-300">
                          Your PIN is only used to authorize this send request and is cleared immediately.
                        </p>
                        <p className="mt-1 text-xs text-ink/60 dark:text-slate-400">
                          After submitting this code, your donation is marked pending until admin verifies wallet SMS records.
                        </p>
                        <p className="mt-1 text-xs text-ink/60 dark:text-slate-400">
                          Tip: set VITE_MOBILE_MONEY_NUMBER in frontend .env to your real pay number.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (paymentGate === "mobile-money" && !isTransactionCodeValid)}
                    className="w-full rounded-xl bg-ocean px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-ocean/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting
                      ? paymentGate === "hosted-checkout"
                        ? "Routing to Secure Gateway..."
                        : paymentGate === "mobile-money"
                          ? "Submitting Receipt..."
                        : "Processing Contribution..."
                      : paymentGate === "hosted-checkout"
                        ? "Initialize Payment"
                        : paymentGate === "mobile-money"
                          ? "Submit Verification Code"
                        : "Complete Secure Contribution"}
                  </button>

                  {paymentGate === "mobile-money" && !isTransactionCodeValid && (
                    <p className="text-xs text-ink/60 dark:text-slate-400">
                      Enter a valid 10-character transaction code to enable submission.
                    </p>
                  )}

                  {submitError && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                      {submitError}
                    </p>
                  )}

                  {submittedReceipt && (
                    <p className="rounded-xl border border-mint/30 bg-mint/15 px-4 py-3 text-sm text-ocean dark:border-mint/20 dark:bg-mint/10 dark:text-mint">
                      Thank you, {submittedReceipt.donor.firstName}. Contribution captured: ${submittedReceipt.amount.toLocaleString()}
                      {donationFrequency === "monthly" ? "/month" : ""}.
                      Receipt {submittedReceipt.transactionId} was downloaded and audit trail confirmation has been issued to {submittedReceipt.donor.email}.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Donate;
