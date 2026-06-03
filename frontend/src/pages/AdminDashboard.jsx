import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const adminKeyStorageKey = "sse-admin-donations-key";

const currencyFormat = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(adminKeyStorageKey) || "");
  const [keyInput, setKeyInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => Boolean(sessionStorage.getItem(adminKeyStorageKey)));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [pendingRows, setPendingRows] = useState([]);
  const [verifyingId, setVerifyingId] = useState("");

  const fetchDashboardData = async (candidateKey) => {
    const activeKey = candidateKey || adminKey;

    if (!activeKey) {
      setErrorMessage("Enter admin passcode to unlock dashboard data.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [donationsResponse, pendingResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/api/donations?limit=200`, {
          headers: { "x-admin-key": activeKey },
        }),
        fetch(`${apiBaseUrl}/api/donations/admin/pending`, {
          headers: { "x-admin-key": activeKey },
        }),
      ]);

      const donationsPayload = await donationsResponse.json();
      const pendingPayload = await pendingResponse.json();

      if (!donationsResponse.ok) {
        throw new Error(donationsPayload.message || "Unable to load donation records.");
      }

      if (!pendingResponse.ok || !pendingPayload?.success) {
        throw new Error(pendingPayload?.message || "Unable to load pending receipt records.");
      }

      setRows(donationsPayload.contributions || []);
      setPendingRows(pendingPayload.records || []);
      setAdminKey(activeKey);
      setIsUnlocked(true);
      sessionStorage.setItem(adminKeyStorageKey, activeKey);
    } catch (error) {
      setRows([]);
      setPendingRows([]);
      setIsUnlocked(false);
      sessionStorage.removeItem(adminKeyStorageKey);
      setErrorMessage(error.message || "Failed to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchDashboardData(adminKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = async (event) => {
    event.preventDefault();
    await fetchDashboardData(keyInput.trim());
  };

  const handleVerify = async (recordId) => {
    if (!recordId || !adminKey) return;

    setErrorMessage("");
    setStatusMessage("");
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
        throw new Error(payload?.message || "Could not verify this receipt.");
      }

      setStatusMessage("Manual receipt marked as verified.");
      await fetchDashboardData(adminKey);
    } catch (error) {
      setErrorMessage(error.message || "Failed to verify receipt.");
    } finally {
      setVerifyingId("");
    }
  };

  const metrics = useMemo(() => {
    const totalRaised = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const receivedCount = rows.filter((row) => row.status === "received").length;
    const manualVerifiedCount = rows.filter(
      (row) => row.paymentGateway === "mobile-money" && row.status === "received" && row.mobileTransactionCode
    ).length;

    return {
      totalRaised,
      totalDonations: rows.length,
      pendingManual: pendingRows.length,
      receivedCount,
      manualVerifiedCount,
    };
  }, [rows, pendingRows]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="h-max rounded-3xl border border-ocean/15 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Admin Panel</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-ink dark:text-slate-100">Control Dashboard</h1>
          <nav className="mt-5 flex flex-col gap-2">
            <Link
              to="/admin/dashboard"
              className="rounded-xl border border-ocean/20 bg-ocean/5 px-4 py-2.5 text-sm font-semibold text-ocean dark:border-slate-700 dark:bg-slate-800 dark:text-mint"
            >
              Dashboard Overview
            </Link>
            <Link
              to="/admin/donations"
              className="rounded-xl border border-ocean/15 px-4 py-2.5 text-sm font-semibold text-ink/80 transition hover:bg-ocean/5 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Donations Audit
            </Link>
            <Link
              to="/admin/donations-config"
              className="rounded-xl border border-ocean/15 px-4 py-2.5 text-sm font-semibold text-ink/80 transition hover:bg-ocean/5 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Donate Config
            </Link>
          </nav>
        </aside>

        <div className="space-y-6">
          {!isUnlocked && (
            <form onSubmit={handleUnlock} className="rounded-3xl border border-ocean/15 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Secure Access</p>
              <h2 className="mt-2 text-xl font-bold text-ink dark:text-slate-100">Enter Admin Passcode</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(event) => setKeyInput(event.target.value)}
                  placeholder="Admin passcode"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean/90 disabled:opacity-70"
                >
                  {isLoading ? "Unlocking..." : "Unlock"}
                </button>
              </div>
            </form>
          )}

          {isUnlocked && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-2xl border border-ocean/15 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Total Raised</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink dark:text-slate-100">{currencyFormat.format(metrics.totalRaised)}</p>
                </article>
                <article className="rounded-2xl border border-ocean/15 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Total Donations</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink dark:text-slate-100">{metrics.totalDonations}</p>
                </article>
                <article className="rounded-2xl border border-ocean/15 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Pending Receipts</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink dark:text-slate-100">{metrics.pendingManual}</p>
                </article>
                <article className="rounded-2xl border border-ocean/15 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Manual Verified</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink dark:text-slate-100">{metrics.manualVerifiedCount}</p>
                </article>
              </div>

              <div className="rounded-3xl border border-ocean/15 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Manual M-Pesa Verification</p>
                    <h2 className="mt-1 text-xl font-bold text-ink dark:text-slate-100">Incoming Receipt Queue</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchDashboardData(adminKey)}
                    disabled={isLoading}
                    className="rounded-xl border border-ocean/20 px-4 py-2 text-sm font-semibold text-ocean transition hover:bg-ocean/5 disabled:opacity-70 dark:border-slate-600 dark:text-mint dark:hover:bg-slate-800"
                  >
                    Refresh
                  </button>
                </div>

                {pendingRows.length === 0 ? (
                  <p className="rounded-2xl border border-ocean/10 bg-sand px-4 py-3 text-sm text-ink/70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    No pending manual receipts right now.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-ocean/10 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-ocean/10 text-sm dark:divide-slate-700">
                      <thead className="bg-ocean/5 dark:bg-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-ink/75 dark:text-slate-200">Donor</th>
                          <th className="px-4 py-3 text-left font-bold text-ink/75 dark:text-slate-200">Phone</th>
                          <th className="px-4 py-3 text-left font-bold text-ink/75 dark:text-slate-200">M-Pesa Code</th>
                          <th className="px-4 py-3 text-left font-bold text-ink/75 dark:text-slate-200">Amount</th>
                          <th className="px-4 py-3 text-left font-bold text-ink/75 dark:text-slate-200">Submitted</th>
                          <th className="px-4 py-3 text-left font-bold text-ink/75 dark:text-slate-200">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ocean/10 dark:divide-slate-700">
                        {pendingRows.map((row) => (
                          <tr key={row._id}>
                            <td className="px-4 py-3 text-ink dark:text-slate-100">{`${row.donor?.firstName || "-"} ${row.donor?.lastName || ""}`.trim()}</td>
                            <td className="px-4 py-3 text-ink/80 dark:text-slate-300">{row.donor?.phoneNumber || "-"}</td>
                            <td className="px-4 py-3 font-semibold text-ocean dark:text-mint">{row.mobileTransactionCode || "-"}</td>
                            <td className="px-4 py-3 text-ink dark:text-slate-100">{currencyFormat.format(Number(row.amount || 0))}</td>
                            <td className="px-4 py-3 text-ink/80 dark:text-slate-300">{new Date(row.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => handleVerify(row._id)}
                                disabled={verifyingId === row._id}
                                className="rounded-lg bg-ocean px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-ocean/90 disabled:opacity-60"
                              >
                                {verifyingId === row._id ? "Verifying..." : "Verify"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-ocean/10 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Received Donations</p>
              <p className="mt-1 text-2xl font-extrabold text-ink dark:text-slate-100">{metrics.receivedCount}</p>
            </article>
            <article className="rounded-2xl border border-ocean/10 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Admin Key Session</p>
              <p className="mt-1 text-sm text-ink/70 dark:text-slate-300">
                {isUnlocked ? "Active for this browser tab" : "Locked"}
              </p>
            </article>
          </div>

          {statusMessage && (
            <p className="rounded-xl border border-mint/30 bg-mint/15 px-4 py-3 text-sm text-ocean dark:border-mint/20 dark:bg-mint/10 dark:text-mint">
              {statusMessage}
            </p>
          )}

          {errorMessage && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
