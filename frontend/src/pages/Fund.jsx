import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const defaultFundData = {
  totalSeedCapital: 30000,
  disbursed: 18500,
  repaid: 9200,
  availablePool: 20700,
  utilization: 62,
  repaymentRate: 50,
  loanRange: "$200 - $1,000",
};

function ProgressMeter({ label, value, colorClass }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-ink/80">{label}</span>
        <span className="font-bold text-ocean">{value}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-ink/10">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Fund() {
  const [fundData, setFundData] = useState(defaultFundData);

  useEffect(() => {
    const fetchFundStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/enterprises/fund/stats`);
        if (!response.ok) return;

        const data = await response.json();
        setFundData(data);
      } catch (_error) {
      }
    };

    fetchFundStats();
  }, []);

  const availablePercent = useMemo(() => {
    return Math.round((fundData.availablePool / fundData.totalSeedCapital) * 100);
  }, [fundData.availablePool, fundData.totalSeedCapital]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="fade-in-up rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Revolving Fund Portal</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
            Youth Enterprise Revolving Fund Lifecycle
          </h1>
          <p className="mt-4 text-ink/70 dark:text-slate-300">
            Growing Creative issues milestone-based 0%-interest micro-runway loans in the {fundData.loanRange} range. As businesses repay, funds are recycled to support the next youth founder cohort.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="fade-in-up delay-1 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wider text-ink/55 dark:text-slate-400">Total Seed Capital</p>
              <p className="mt-2 font-display text-3xl font-bold text-ocean">${fundData.totalSeedCapital.toLocaleString()}</p>
            </div>
            <div className="fade-in-up delay-1 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wider text-ink/55 dark:text-slate-400">Available Pool</p>
              <p className="mt-2 font-display text-3xl font-bold text-ocean">${fundData.availablePool.toLocaleString()}</p>
            </div>
            <div className="fade-in-up delay-2 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wider text-ink/55 dark:text-slate-400">Disbursed</p>
              <p className="mt-2 font-display text-3xl font-bold text-ocean">${fundData.disbursed.toLocaleString()}</p>
            </div>
            <div className="fade-in-up delay-2 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wider text-ink/55 dark:text-slate-400">Repaid</p>
              <p className="mt-2 font-display text-3xl font-bold text-ocean">${fundData.repaid.toLocaleString()}</p>
            </div>
          </div>
        </article>

        <aside className="fade-in-up delay-1 rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Live Pool Health</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-slate-400">Progress meters for international sponsors and governance teams.</p>

          <div className="mt-8 space-y-6">
            <div className="fade-in-up delay-1">
              <ProgressMeter label="Fund Utilization" value={fundData.utilization} colorClass="bg-ocean" />
            </div>
            <div className="fade-in-up delay-2">
              <ProgressMeter label="Repayment Performance" value={fundData.repaymentRate} colorClass="bg-mint" />
            </div>
            <div className="fade-in-up delay-3">
              <ProgressMeter label="Pool Liquidity" value={availablePercent} colorClass="bg-sunrise" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Fund;
