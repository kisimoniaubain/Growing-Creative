import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const adminKeyStorageKey = "sse-admin-donations-key";

const toGatewayLabel = (gatewayKey, mobileProvider) => {
  if (gatewayKey === "mobile-money") {
    if (mobileProvider === "mpesa") return "Mobile Money (M-Pesa)";
    if (mobileProvider === "airtel-money") return "Mobile Money (Airtel Money)";
    return "Mobile Money";
  }

  if (gatewayKey === "credit-debit") return "Credit / Debit";
  if (gatewayKey === "bank-wire") return "Bank Wire / EFT";
  return gatewayKey || "-";
};

const buildPaymentTimeline = (row) => {
  const isMobile = row.paymentGateway === "mobile-money";
  const callbackSeen = String(row.auditTrail?.statement || "").toLowerCase().includes("payment callback");
  const hasProviderReference = Boolean(row.mobileTransactionCode);

  return [
    {
      key: "initiated",
      label: "Initiated",
      state: isMobile ? (row.mobileChargeRequestId ? "done" : "missing") : "not-applicable",
      detail: isMobile ? (row.mobileChargeRequestId || "No request ID") : "N/A",
    },
    {
      key: "callback",
      label: "Callback",
      state: isMobile ? (callbackSeen || hasProviderReference ? "done" : "pending") : "not-applicable",
      detail: isMobile ? (callbackSeen ? "Received" : "Awaiting") : "N/A",
    },
    {
      key: "final",
      label: "Final",
      state: row.status === "received" ? "done" : row.status === "failed" ? "failed" : row.status === "pending" ? "pending" : "not-applicable",
      detail: row.status || "unknown",
    },
  ];
};

const getProviderHealth = (providerSummary) => {
  const configured = Boolean(providerSummary?.configured);
  const httpsReady = Boolean(providerSummary?.callbackHttps);

  if (configured && httpsReady) {
    return {
      label: "Ready",
      className: "border-mint/30 bg-mint/15 text-ocean dark:border-mint/20 dark:bg-mint/10 dark:text-mint",
    };
  }

  if (configured || httpsReady) {
    return {
      label: "Partial",
      className: "border-sunrise/40 bg-sunrise/20 text-ink dark:border-sunrise/30 dark:bg-sunrise/10 dark:text-sunrise",
    };
  }

  return {
    label: "Missing",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
  };
};

function DonationsAdmin() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [routingSummary, setRoutingSummary] = useState(null);
  const [routingSummaryError, setRoutingSummaryError] = useState("");
  const [pendingManualRows, setPendingManualRows] = useState([]);
  const [verifyActionMessage, setVerifyActionMessage] = useState("");
  const [verifyingId, setVerifyingId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(adminKeyStorageKey) || "");
  const [keyInput, setKeyInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => Boolean(sessionStorage.getItem(adminKeyStorageKey)));

  const loadContributions = async (candidateKey) => {
    const activeKey = candidateKey || adminKey;

    if (!activeKey) {
      setErrorMessage("Enter admin passcode to unlock donation audit data.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/donations?limit=200`, {
        headers: {
          "x-admin-key": activeKey,
        },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to fetch donations.");
      }

      setRows(payload.contributions || []);
      setAdminKey(activeKey);
      sessionStorage.setItem(adminKeyStorageKey, activeKey);
      setIsUnlocked(true);

      try {
        const summaryResponse = await fetch(`${apiBaseUrl}/api/donations/payment-routing-summary`, {
          headers: {
            "x-admin-key": activeKey,
          },
        });
        const summaryPayload = await summaryResponse.json();
        if (!summaryResponse.ok) {
          throw new Error(summaryPayload.message || "Unable to load routing summary.");
        }
        setRoutingSummary(summaryPayload);
        setRoutingSummaryError("");
      } catch (summaryError) {
        setRoutingSummary(null);
        setRoutingSummaryError(summaryError.message || "Failed to load routing summary.");
      }

      try {
        const pendingResponse = await fetch(`${apiBaseUrl}/api/donations/admin/pending`, {
          headers: {
            "x-admin-key": activeKey,
          },
        });
        const pendingPayload = await pendingResponse.json();
        if (!pendingResponse.ok || !pendingPayload?.success) {
          throw new Error(pendingPayload?.message || "Unable to load pending manual records.");
        }
        setPendingManualRows(pendingPayload.records || []);
      } catch (_pendingError) {
        setPendingManualRows([]);
      }
    } catch (error) {
      setRows([]);
      setRoutingSummary(null);
      setRoutingSummaryError("");
      setPendingManualRows([]);
      setIsUnlocked(false);
      sessionStorage.removeItem(adminKeyStorageKey);
      setErrorMessage(error.message || "Failed to load donations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      loadContributions(adminKey);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = (event) => {
    event.preventDefault();
    loadContributions(keyInput.trim());
  };

  const handleLock = () => {
    setRows([]);
    setRoutingSummary(null);
    setRoutingSummaryError("");
    setPendingManualRows([]);
    setVerifyActionMessage("");
    setSearchText("");
    setAdminKey("");
    setKeyInput("");
    setIsUnlocked(false);
    sessionStorage.removeItem(adminKeyStorageKey);
    setErrorMessage("");
  };

  const handleVerifyPending = async (recordId) => {
    if (!adminKey || !recordId) return;
    setVerifyActionMessage("");
    setVerifyingId(recordId);

    try {
      const response = await fetch(`${apiBaseUrl}/api/donations/admin/verify/${recordId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to verify record.");
      }

      setVerifyActionMessage("Donation verified and marked as received.");
      await loadContributions(adminKey);
    } catch (error) {
      setVerifyActionMessage(error.message || "Verification failed.");
    } finally {
      setVerifyingId("");
    }
  };

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;

    const needle = searchText.trim().toLowerCase();
    return rows.filter((item) => {
      const donorName = `${item.donor?.firstName || ""} ${item.donor?.lastName || ""}`.toLowerCase();
      const donorEmail = (item.donor?.email || "").toLowerCase();
      const transactionId = (item.transactionId || "").toLowerCase();
      return donorName.includes(needle) || donorEmail.includes(needle) || transactionId.includes(needle);
    });
  }, [rows, searchText]);

  const totals = useMemo(() => {
    const totalAmount = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    return {
      count: rows.length,
      totalAmount,
    };
  }, [rows]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Admin Donations Table</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">Donation Audit Review</h1>
        <p className="mt-3 text-sm text-ink/70 dark:text-slate-300">
          Live contribution records from the revolving fund intake endpoint.
        </p>

        <div className="mt-4">
          <Link
            to="/admin/donations-config"
            className="inline-flex items-center rounded-xl border border-ocean/25 px-4 py-2 text-sm font-semibold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:text-mint dark:hover:bg-slate-800"
          >
            Edit Donate Tiers
          </Link>
        </div>

        {!isUnlocked && (
          <form onSubmit={handleUnlock} className="mt-6 rounded-2xl border border-ocean/15 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">
              Admin Passcode Required
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="password"
                value={keyInput}
                onChange={(event) => setKeyInput(event.target.value)}
                placeholder="Enter admin passcode"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
              />
              <button
                type="submit"
                className="rounded-xl bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean/90"
              >
                Unlock
              </button>
            </div>
          </form>
        )}

        {isUnlocked && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleLock}
              className="rounded-xl border border-ocean/20 px-4 py-2 text-sm font-semibold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:text-mint dark:hover:bg-slate-800"
            >
              Lock Audit View
            </button>
          </div>
        )}

        {isUnlocked && (
          <>

        <div className="mt-6 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Payment Routing Summary</p>
          {routingSummary && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ocean/10 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink dark:text-slate-100">M-Pesa</p>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${getProviderHealth(routingSummary.mpesa).className}`}>
                    {getProviderHealth(routingSummary.mpesa).label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink/70 dark:text-slate-300">Env: {routingSummary.mpesa?.env || "-"}</p>
                <p className="text-xs text-ink/70 dark:text-slate-300">Shortcode: {routingSummary.mpesa?.shortcodeMasked || "-"}</p>
                <p className="text-xs text-ink/70 dark:text-slate-300">HTTPS Callback: {String(routingSummary.mpesa?.callbackHttps)}</p>
                <p className="text-xs font-semibold text-ink dark:text-slate-200">Configured: {String(routingSummary.mpesa?.configured)}</p>
              </div>
              <div className="rounded-xl border border-ocean/10 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink dark:text-slate-100">Airtel Money</p>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${getProviderHealth(routingSummary.airtel).className}`}>
                    {getProviderHealth(routingSummary.airtel).label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink/70 dark:text-slate-300">Env: {routingSummary.airtel?.env || "-"}</p>
                <p className="text-xs text-ink/70 dark:text-slate-300">Client ID: {routingSummary.airtel?.clientIdMasked || "-"}</p>
                <p className="text-xs text-ink/70 dark:text-slate-300">HTTPS Callback: {String(routingSummary.airtel?.callbackHttps)}</p>
                <p className="text-xs font-semibold text-ink dark:text-slate-200">Configured: {String(routingSummary.airtel?.configured)}</p>
              </div>
            </div>
          )}
          {routingSummaryError && (
            <p className="mt-3 text-xs text-red-700 dark:text-red-300">{routingSummaryError}</p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Total Contributions</p>
            <p className="mt-2 text-2xl font-extrabold text-ink dark:text-slate-100">{totals.count}</p>
          </article>
          <article className="rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800 sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Capital Captured</p>
            <p className="mt-2 text-2xl font-extrabold text-ink dark:text-slate-100">${totals.totalAmount.toLocaleString()}</p>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">
              Pending Manual Verification
            </p>
            <span className="rounded-full border border-sunrise/40 bg-sunrise/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink dark:border-sunrise/30 dark:bg-sunrise/10 dark:text-sunrise">
              {pendingManualRows.length} Pending
            </span>
          </div>

          {verifyActionMessage && (
            <p className="mt-2 text-xs font-semibold text-ocean dark:text-mint">{verifyActionMessage}</p>
          )}

          {pendingManualRows.length === 0 ? (
            <p className="mt-3 text-sm text-ink/65 dark:text-slate-300">No pending manual records right now.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {pendingManualRows.map((record) => (
                <div key={record._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ocean/10 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <div className="text-xs text-ink/80 dark:text-slate-200">
                    <p className="font-bold text-ocean dark:text-mint">{record.mobileTransactionCode || "-"}</p>
                    <p>{record.donor?.phoneNumber || "-"} • {record.currency} {Number(record.amount || 0).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyPending(record._id)}
                    disabled={verifyingId === record._id}
                    className="rounded-xl bg-ocean px-3 py-2 text-xs font-bold text-white transition hover:bg-ocean/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {verifyingId === record._id ? "Verifying..." : "Mark as Received"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by donor name, email, or transaction ID"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
          />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-ocean/10 dark:border-slate-700">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-sand text-ink/80 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Transaction ID</th>
                <th className="px-4 py-3 font-bold">Donor</th>
                <th className="px-4 py-3 font-bold">Gateway</th>
                <th className="px-4 py-3 font-bold">Payment Timeline</th>
                <th className="px-4 py-3 font-bold">Amount</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-ink/70 dark:text-slate-300">
                    Loading donations...
                  </td>
                </tr>
              )}

              {!isLoading && errorMessage && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-red-600 dark:text-red-300">
                    {errorMessage}
                  </td>
                </tr>
              )}

              {!isLoading && !errorMessage && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-ink/70 dark:text-slate-300">
                    No donation records found for your current filter.
                  </td>
                </tr>
              )}

              {!isLoading && !errorMessage && filteredRows.map((row) => {
                const timeline = buildPaymentTimeline(row);
                return (
                  <tr key={row.transactionId} className="border-t border-ocean/10 dark:border-slate-700">
                    <td className="px-4 py-3 text-ink/75 dark:text-slate-300">{new Date(row.issuedAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-ocean dark:text-mint">{row.transactionId}</td>
                    <td className="px-4 py-3 text-ink/80 dark:text-slate-100">
                      <p>{row.donor?.firstName} {row.donor?.lastName}</p>
                      <p className="text-xs text-ink/60 dark:text-slate-400">{row.donor?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/75 dark:text-slate-300">{toGatewayLabel(row.paymentGateway, row.mobileProvider)}</td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-[240px] flex-wrap gap-2">
                        {timeline.map((step) => {
                          const stepClass =
                            step.state === "done"
                              ? "border-mint/30 bg-mint/15 text-ocean dark:border-mint/20 dark:bg-mint/10 dark:text-mint"
                              : step.state === "failed"
                                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                                : step.state === "pending"
                                  ? "border-sunrise/40 bg-sunrise/20 text-ink dark:border-sunrise/30 dark:bg-sunrise/10 dark:text-sunrise"
                                  : "border-slate-300 bg-white text-ink/70 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300";

                          return (
                            <span key={step.key} className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${stepClass}`} title={step.detail}>
                              {step.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-ink dark:text-slate-100">${Number(row.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-mint/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ocean dark:bg-mint/15 dark:text-mint">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {row.status === "pending" && row.paymentGateway === "mobile-money" ? (
                        <button
                          type="button"
                          onClick={() => handleVerifyPending(row._id)}
                          disabled={verifyingId === row._id}
                          className="rounded-xl bg-ocean px-3 py-1.5 text-xs font-bold text-white transition hover:bg-ocean/90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {verifyingId === row._id ? "Verifying..." : "Verify"}
                        </button>
                      ) : (
                        <span className="text-xs text-ink/50 dark:text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
          </>
        )}

        {!isUnlocked && !errorMessage && (
          <p className="mt-6 text-sm text-ink/60 dark:text-slate-400">
            Enter the passcode to access contribution records.
          </p>
        )}

        {!isLoading && errorMessage && (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}

export default DonationsAdmin;
