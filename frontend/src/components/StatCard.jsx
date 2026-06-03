function StatCard({ value, label }) {
  return (
    <article className="fade-in-up rounded-2xl border border-white/10 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <p className="font-display text-3xl font-bold text-ocean">{value}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink/70 dark:text-slate-300">{label}</p>
    </article>
  );
}

export default StatCard;
