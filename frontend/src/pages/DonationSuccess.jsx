import { Link, useLocation } from "react-router-dom";

function DonationSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const statusRaw = (params.get("status") || "").toLowerCase();
  const txRef = params.get("tx_ref") || params.get("txRef") || "";
  const transactionId = params.get("transaction_id") || params.get("transactionId") || "";

  const isSuccess = statusRaw === "successful" || statusRaw === "completed" || statusRaw === "success";
  const isFailed = statusRaw === "failed" || statusRaw === "cancelled";

  const title = isSuccess
    ? "Payment Confirmed"
    : isFailed
      ? "Payment Not Completed"
      : "Payment Status Received";

  const message = isSuccess
    ? "Thank you for your contribution. Your payment was received by the secure gateway."
    : isFailed
      ? "The payment was not completed. You can return and try again."
      : "We received your payment response. Please check your email or admin dashboard for final confirmation.";

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-ocean/20 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean/70 dark:text-mint/80">Donation Gateway Response</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/75 dark:text-slate-300">{message}</p>

        <div className="mt-6 space-y-2 rounded-2xl border border-ocean/15 bg-sand p-4 text-sm text-ink/80 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <p>
            Status: <span className="font-bold uppercase">{statusRaw || "unknown"}</span>
          </p>
          {txRef && (
            <p>
              Reference: <span className="font-bold">{txRef}</span>
            </p>
          )}
          {transactionId && (
            <p>
              Gateway Transaction ID: <span className="font-bold">{transactionId}</span>
            </p>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/donate"
            className="inline-flex items-center rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90"
          >
            Back To Donate
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-xl border border-ocean/25 bg-white px-5 py-3 text-sm font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:bg-slate-800 dark:text-mint dark:hover:bg-slate-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DonationSuccess;
