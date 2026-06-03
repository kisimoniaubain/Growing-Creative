const pillars = [
  {
    title: "Skills Development",
    description:
      "Entrepreneurship, digital capability, and vocational excellence across arts, fashion, ICT, agriculture, and renewable energy.",
  },
  {
    title: "Business Incubation",
    description:
      "Structured mentorship and idea-to-enterprise support at the K2 Z2 B7 Youth Innovation and Creativity Hub.",
  },
  {
    title: "Access to Finance",
    description:
      "A revolving youth enterprise fund offering startup support between $200 and $1,000 with accountability-driven release.",
  },
  {
    title: "Market Integration",
    description:
      "Local and online market channels that connect youth-led products and services to paying customers.",
  },
];

const outcomes = [
  "300 youth recruited and trained in practical business and technical skills",
  "150 youth enterprises launched and supported through incubation",
  "$30,000 seed capital mobilized under a transparent revolving model",
  "Long-term job creation and reduced youth unemployment in local communities",
];

const whyChooseUs = [
  {
    title: "Transparent Revolving Fund",
    description:
      "Every funded step can be tracked, and repayments are recycled to support new founders.",
  },
  {
    title: "Practical Market Pathways",
    description:
      "Training is connected directly to market access, sales channels, and customer-facing outcomes.",
  },
  {
    title: "Mentor-Guided Growth",
    description:
      "Youth are paired with experienced mentors to reduce startup risk and improve business survival.",
  },
  {
    title: "Community Impact Focus",
    description:
      "The model is designed to create jobs, improve household income, and grow local enterprise ecosystems.",
  },
];

function About() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="fade-in-up rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">About Growing Creative</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
          Growing Creative
        </h1>
        <p className="mt-5 max-w-4xl text-base text-ink/75 dark:text-slate-300">
          Growing Creative is a social enterprise initiative established in 2025 at K2 Z2 B7 to empower young people aged 18 to 30 who have completed secondary school. We help youth transform creativity, technical skills, and education into sustainable businesses through training, incubation, mentorship, and responsible financing.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="fade-in-up delay-1 rounded-3xl bg-white p-7 shadow-soft dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Vision</h2>
          <p className="mt-3 text-ink/75 dark:text-slate-300">
            To nurture a generation of creative, skilled, and self-reliant youth contributing to sustainable community development.
          </p>
          <h2 className="mt-7 font-display text-2xl font-bold text-ink dark:text-slate-100">Mission</h2>
          <p className="mt-3 text-ink/75 dark:text-slate-300">
            To equip young people with practical skills, business knowledge, mentorship, and resources required to build sustainable livelihoods.
          </p>
        </article>

        <article className="fade-in-up delay-1 rounded-3xl bg-white p-7 shadow-soft dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Why It Matters</h2>
          <p className="mt-3 text-ink/75 dark:text-slate-300">
            Many secondary school graduates and talented youth remain unemployed despite strong creative potential. Growing Creative bridges the gap between education and employment by turning skills into enterprise, income, and local economic impact.
          </p>
          <div className="mt-6 rounded-2xl border border-ocean/15 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean dark:text-mint">Headquarters</p>
            <p className="mt-1 font-display text-xl font-bold text-ink dark:text-slate-100">K2 Z2 B7 Innovation Hub</p>
            <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">Established 2025</p>
          </div>
        </article>
      </div>

      <div className="fade-in-up delay-2 mt-8 rounded-3xl bg-white p-7 shadow-soft dark:bg-slate-900">
        <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Our Four-Component Approach</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {pillars.map((pillar, index) => (
            <article key={pillar.title} className={`fade-in-up delay-${Math.min(index + 1, 3)} rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800`}>
              <h3 className="font-display text-xl font-bold text-ocean dark:text-mint">{pillar.title}</h3>
              <p className="mt-2 text-sm text-ink/75 dark:text-slate-300">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="fade-in-up delay-2 mt-8 rounded-3xl bg-white p-7 shadow-soft dark:bg-slate-900">
        <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Why Choose Us</h2>
        <p className="mt-3 max-w-3xl text-ink/70 dark:text-slate-300">
          Growing Creative combines trusted governance, market-driven training, and measurable youth outcomes for partners, donors, and communities.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {whyChooseUs.map((item, index) => (
            <article key={item.title} className={`fade-in-up delay-${Math.min(index + 1, 3)} rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800`}>
              <h3 className="font-display text-xl font-bold text-ocean dark:text-mint">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/75 dark:text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="fade-in-up delay-3 rounded-3xl bg-white p-7 shadow-soft dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Expected Outcomes</h2>
          <ul className="mt-5 space-y-3 text-sm text-ink/80 dark:text-slate-300">
            {outcomes.map((item, index) => (
              <li key={item} className={`fade-in-up delay-${Math.min(index + 1, 3)} rounded-xl border border-ocean/10 bg-sand px-4 py-3 dark:border-slate-700 dark:bg-slate-800`}>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="fade-in-up delay-3 rounded-3xl bg-white p-7 shadow-soft dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Donor Transparency Promise</h2>
          <p className="mt-3 text-ink/75 dark:text-slate-300">
            Our revolving fund model is designed for sustainability: repaid capital is recycled to support new youth founders. Through digital tracking of applications, enterprises, and transactions, Growing Creative provides visibility and accountability for every stage of support.
          </p>
          <p className="mt-5 text-ink/75 dark:text-slate-300">
            We prioritize milestone-based support and mentorship to reduce startup failure risk and improve enterprise survival rates.
          </p>
        </article>
      </div>
    </section>
  );
}

export default About;
