import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const pulseMetrics = [
  { label: "Total Jobs Created", value: "300+", note: "Youth Self-Employed" },
  { label: "Capital Velocity", value: "$30,000", note: "Capital Disbursed via Revolving Fund" },
  { label: "Market Traction", value: "128", note: "Active Storefronts on Growing Creative Marketplace" },
  { label: "Economic Lift", value: "+87%", note: "Average Increase in Participant Household Income" },
];

const incomeTimeline = [
  { stage: "Baseline (Day 0)", amount: 70 },
  { stage: "Graduation (Month 3)", amount: 140 },
  { stage: "Post-Funding (Month 6)", amount: 235 },
  { stage: "Market Scale (Month 12)", amount: 360 },
];

const trackPerformance = [
  { track: "Arts", inventory: 58, orders: 42, revenue: 33 },
  { track: "Fashion", inventory: 64, orders: 56, revenue: 44 },
  { track: "ICT", inventory: 48, orders: 51, revenue: 60 },
  { track: "Agri", inventory: 55, orders: 47, revenue: 40 },
  { track: "Energy", inventory: 37, orders: 35, revenue: 41 },
];

const sdgRings = [
  { title: "Renewable Energy", metric: "2,850 kWh", progress: 76, tone: "var(--brand-ocean)" },
  { title: "Sustainable Ag", metric: "48 Tons", progress: 68, tone: "var(--brand-mint)" },
  { title: "Circular Economy", metric: "62% Recycled", progress: 62, tone: "var(--brand-sunrise)" },
];

const advisoryBoard = [
  {
    name: "Venkatesh R Kamath",
    role: "Technical Infrastructure Lead",
    bio: "Leads platform architecture, security governance, and high-availability systems for transparent public reporting.",
  },
  {
    name: "Lilian Auma",
    role: "Financial Risk Assessor",
    bio: "Oversees revolving fund risk controls, repayment logic, and quarterly compliance evidence for grant partners.",
  },
  {
    name: "David Ekiru",
    role: "Public-Private Partnerships Advisor",
    bio: "Coordinates institutional partnerships with local leaders, sponsors, and policy stakeholders for long-term scale.",
  },
];

const mentors = [
  "Ruth Nangiro - Cooperative Chair",
  "Joel Otieno - Marketplace Operations Mentor",
  "Amina Chabari - Fashion Cluster Lead",
  "Kelvin Ekal - ICT Growth Coach",
  "Nuru Lokiru - Renewable Energy Mentor",
];

const reportDownloads = [
  {
    label: "Annual Impact Report (2025 Comprehensive Review)",
    fileSize: "PDF | 4.2 MB",
    href: "/docs/Annual_Impact_Report_2025.pdf",
  },
  {
    label: "Revolving Fund Financial Audit & Repayment Matrix",
    fileSize: "PDF | 2.8 MB",
    href: "/docs/Revolving_Fund_Financial_Audit_Repayment_Matrix.pdf",
  },
  {
    label: "Growing Creative M&E Data Collection Methodology Framework",
    fileSize: "PDF | 1.5 MB",
    href: "/docs/Growing Creative_ME_Data_Collection_Methodology_Framework.pdf",
  },
];

function LineChart() {
  const points = useMemo(() => {
    const max = Math.max(...incomeTimeline.map((item) => item.amount));
    return incomeTimeline.map((item, index) => {
      const x = 60 + index * 215;
      const y = 270 - (item.amount / max) * 200;
      return { ...item, x, y };
    });
  }, []);

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="rounded-2xl border border-ocean/15 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <svg viewBox="0 0 760 320" className="h-64 w-full" role="img" aria-label="Income growth over twelve months">
        <line x1="60" y1="270" x2="710" y2="270" stroke="var(--brand-ocean)" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="60" y1="40" x2="60" y2="270" stroke="var(--brand-ocean)" strokeOpacity="0.35" strokeWidth="1" />
        <polyline points={polyline} fill="none" stroke="var(--brand-ocean)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <g key={point.stage}>
            <circle cx={point.x} cy={point.y} r="6" fill="var(--brand-mint)" />
            <text x={point.x} y={point.y - 12} textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
              ${point.amount}
            </text>
            <text x={point.x} y="300" textAnchor="middle" className="fill-slate-500 text-[10px]">
              {point.stage}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function StackedBarChart() {
  return (
    <div className="rounded-2xl border border-ocean/15 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <div className="space-y-4">
        {trackPerformance.map((item) => {
          const total = item.inventory + item.orders + item.revenue;
          const inv = (item.inventory / total) * 100;
          const ord = (item.orders / total) * 100;
          const rev = (item.revenue / total) * 100;
          return (
            <div key={item.track}>
              <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink/70 dark:text-slate-300">
                <span>{item.track}</span>
                <span>{total} total activity points</span>
              </div>
              <div className="flex h-5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="bg-ocean" style={{ width: `${inv}%` }} title="Inventory Throughput" />
                <div className="bg-mint" style={{ width: `${ord}%` }} title="Orders Fulfilled" />
                <div className="bg-sunrise" style={{ width: `${rev}%` }} title="Revenue Processed" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-ink/70 dark:text-slate-300">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-ocean" />Inventory Throughput</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-mint" />Orders Fulfilled</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sunrise" />Revenue Processed</span>
      </div>
    </div>
  );
}

function RingChart() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {sdgRings.map((item) => (
        <article key={item.title} className="rounded-2xl border border-ocean/15 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-900">
          <div
            className="mx-auto grid h-24 w-24 place-items-center rounded-full"
            style={{ background: `conic-gradient(${item.tone} ${item.progress}%, var(--brand-sand) ${item.progress}% 100%)` }}
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-xs font-bold text-ink dark:bg-slate-900 dark:text-slate-100">
              {item.progress}%
            </div>
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-ink dark:text-slate-100">{item.title}</h3>
          <p className="mt-1 text-sm text-ocean dark:text-mint">{item.metric}</p>
        </article>
      ))}
    </div>
  );
}

function ImpactGovernanceME() {
  const [activeTab, setActiveTab] = useState("income");

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="fade-in-up rounded-3xl border border-ocean/15 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Impact, Governance & M&E</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
          Transparency in Action: Our Impact & Governance
        </h1>
        <p className="mt-4 text-ink/75 dark:text-slate-300">
          Programmatic accountability, rigorous monitoring, and verified community outcomes for the Growing Creative Initiative.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pulseMetrics.map((metric, index) => (
            <article key={metric.label} className={`fade-in-up delay-${Math.min(index + 1, 3)} rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800`}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">{metric.label}</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-ink dark:text-slate-100">{metric.value}</p>
              <p className="mt-1 text-sm text-ink/70 dark:text-slate-300">{metric.note}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="fade-in-up delay-1 mt-8 rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Interactive M&E Data Dashboard</h2>
        <p className="mt-2 text-sm text-ink/65 dark:text-slate-400">Toggle performance vectors without leaving the page.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setActiveTab("income")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === "income" ? "bg-ocean text-white" : "bg-sand text-ink hover:bg-ocean/10 dark:bg-slate-800 dark:text-slate-200"}`}>
            Economic Mobility
          </button>
          <button type="button" onClick={() => setActiveTab("market")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === "market" ? "bg-ocean text-white" : "bg-sand text-ink hover:bg-ocean/10 dark:bg-slate-800 dark:text-slate-200"}`}>
            Market Participation
          </button>
          <button type="button" onClick={() => setActiveTab("sdg")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === "sdg" ? "bg-ocean text-white" : "bg-sand text-ink hover:bg-ocean/10 dark:bg-slate-800 dark:text-slate-200"}`}>
            SDG & Environmental Audits
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "income" && <LineChart />}
          {activeTab === "market" && <StackedBarChart />}
          {activeTab === "sdg" && <RingChart />}
        </div>
      </div>

      <div className="fade-in-up delay-2 mt-8 rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Institutional Legitimacy & Governance</h2>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Project Advisory Board</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {advisoryBoard.map((member) => (
            <article key={member.name} className="rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ocean/15 text-base font-bold text-ocean dark:bg-mint/20 dark:text-mint">
                {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
              </div>
              <p className="font-display text-lg font-bold text-ink dark:text-slate-100">{member.name}</p>
              <p className="mt-1 text-sm font-semibold text-ocean dark:text-mint">{member.role}</p>
              <p className="mt-2 text-sm text-ink/75 dark:text-slate-300">{member.bio}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Local Community Leaders & Industry Mentors</h3>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {mentors.map((mentor) => (
            <article key={mentor} className="min-w-[260px] rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm font-semibold text-ink dark:text-slate-100">{mentor}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Ecosystem Oversight</p>
            </article>
          ))}
        </div>
      </div>

      <div className="fade-in-up delay-3 mt-8 rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Document Repository & Public Accountability</h2>
        <div className="mt-4">
          <Link
            to="/admin/donations"
            className="inline-flex items-center rounded-xl bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean/90"
          >
            View Donations Audit Table
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {reportDownloads.map((item) => (
            <article key={item.href} className="flex flex-col gap-3 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink dark:text-slate-100">{item.label}</p>
                <p className="text-xs uppercase tracking-wide text-ink/60 dark:text-slate-400">{item.fileSize}</p>
              </div>
              <a href={item.href} download className="inline-flex items-center rounded-xl bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean/90">
                Download
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactGovernanceME;

