import { useEffect, useRef, useState } from "react";

const journeySteps = [
  {
    id: "1",
    title: "Mobilization & Training",
    phase: "Phase 1: Foundations",
    summary: "Transforming Mindsets and Building Core Competencies.",
    description:
      "The journey begins with immersive, classroom-based workshops designed to build a strong professional baseline. Participants do not just learn a trade; they undergo holistic development across three vital areas:",
    bullets: [
      "Technical Mastery: Deep-dive practical training in their chosen creative track.",
      "Business Essentials: Market research, lean startup methodologies, and operational planning.",
      "Financial Literacy: Budgeting, cash flow management, and personal financial discipline.",
    ],
  },
  {
    id: "2",
    title: "Incubation & Mentorship",
    phase: "Phase 2: Refining the Model",
    summary: "Turning Raw Concepts into Viable Business Plans.",
    description:
      "Moving out of the classroom, youth enter the Hub's incubation space. Here, ideas are stress-tested and refined through close collaboration with seasoned industry specialists.",
    bullets: [
      "Co-Working Access: Free access to the Innovation Hub's workspaces, internet, and prototyping tools.",
      "Local Leader Mentorship: Weekly 1-on-1 coaching sessions with established local business owners and creative leaders.",
      "Pitch Preparation: Developing a concrete, data-backed business plan ready for funding.",
    ],
  },
  {
    id: "3",
    title: "Access to Finance",
    phase: "Phase 3: Launch Capital",
    summary: "Fueling Growth with Seed Funding.",
    description:
      "A great business plan is nothing without capital. To bridge the traditional banking gap, graduates pitch their finalized models to access our specialized Revolving Fund.",
    bullets: [
      "Micro-Loans: Flexible micro-funding ranging from $200 to $1,000 based on business scale and initial material needs.",
      "Fair Terms: Community-friendly interest rates designed to be paid back as the business grows, replenishing the fund for the next cohort.",
      "Asset Support: Guidance on utilizing capital for critical raw materials, tools, and initial branding.",
    ],
  },
  {
    id: "4",
    title: "Market Linkages",
    phase: "Phase 4: Scaling Horizons",
    summary: "Connecting Local Talent to a Global Audience.",
    description:
      "Graduation is just the beginning. To ensure long-term self-employment, we provide immediate, structural entry into the commercial market.",
    bullets: [
      "Growing Creative Online Marketplace: Instant placement on our custom e-commerce platform, exposing finished products to regional and global buyers.",
      "Expos & Showcases: Opportunities to exhibit physical items at Hub-sponsored community markets and trade fairs.",
      "B2B Pipelines: Direct connections to corporate contracts and local retail partnerships.",
    ],
  },
];

function HowItWorks() {
  const journeyRef = useRef(null);
  const [journeyProgress, setJourneyProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!journeyRef.current) return;

      const rect = journeyRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.85;
      const end = -rect.height * 0.3;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, raw));
      setJourneyProgress(clamped);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <section
      ref={journeyRef}
      id="how-it-works"
      className="fade-in-up delay-1 relative overflow-hidden bg-sand py-16 dark:bg-slate-900 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(15,76,92,0.12),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(255,178,76,0.16),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">How It Works</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
            From Aspiration to Enterprise: The Innovator&apos;s Journey
          </h1>
          <p className="mt-4 text-base text-ink/75 dark:text-slate-300 sm:text-lg">
            Our structured, 4-step pipeline provides the training, mentorship, capital, and market access required to transform driven young individuals into thriving business owners.
          </p>
        </div>

        <div className="relative mt-10 lg:hidden">
          <div className="absolute bottom-0 left-5 top-0 w-1 rounded-full bg-slate-300/80 dark:bg-slate-700">
            <div
              className="w-full rounded-full bg-ocean transition-[height] duration-300 dark:bg-mint"
              style={{ height: `${journeyProgress * 100}%` }}
            />
          </div>

          <div className="space-y-6">
            {journeySteps.map((step, index) => (
              <article
                key={step.id}
                className={`fade-in-up delay-${Math.min(index + 1, 3)} relative rounded-3xl border border-ocean/10 bg-white/90 p-5 pl-16 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/75`}
              >
                <div className="absolute left-1 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-sm font-extrabold text-white shadow-lg dark:bg-mint dark:text-slate-950">
                  {step.id}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ocean/80 dark:text-mint">{step.phase}</p>
                <h2 className="mt-2 text-xl font-extrabold text-ink dark:text-slate-100">{step.title}</h2>
                <p className="mt-1 text-sm font-semibold text-ink/80 dark:text-slate-300">{step.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-slate-300">{step.description}</p>
                <div className="mt-4 space-y-2">
                  {step.bullets.map((bullet) => (
                    <p key={bullet} className="text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                      {bullet.includes("$200 to $1,000") ? (
                        <>
                          Micro-Loans: Flexible micro-funding ranging from <span className="font-extrabold text-ocean dark:text-mint">$200 to $1,000</span> based on business scale and initial material needs.
                        </>
                      ) : bullet.includes("Growing Creative Online Marketplace") ? (
                        <>
                          <span className="font-extrabold text-ocean dark:text-mint">Growing Creative Online Marketplace</span>: Instant placement on our custom e-commerce platform, exposing finished products to regional and global buyers.
                        </>
                      ) : (
                        bullet
                      )}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mt-12 hidden lg:block">
          <div className="absolute left-[11%] right-[11%] top-6 h-1 rounded-full bg-slate-300/80 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-ocean transition-[width] duration-300 dark:bg-mint"
              style={{ width: `${journeyProgress * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            {journeySteps.map((step, index) => (
              <article
                key={step.id}
                className={`fade-in-up delay-${Math.min(index + 1, 3)} relative mt-4 rounded-3xl border border-ocean/10 bg-white/92 p-5 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/75`}
              >
                <div className="mx-auto -mt-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ocean text-lg font-extrabold text-white shadow-lg dark:bg-mint dark:text-slate-950">
                  {step.id}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ocean/80 dark:text-mint">{step.phase}</p>
                <h2 className="mt-2 text-xl font-extrabold text-ink dark:text-slate-100">{step.title}</h2>
                <p className="mt-1 text-sm font-semibold text-ink/80 dark:text-slate-300">{step.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-slate-300">{step.description}</p>
                <div className="mt-4 space-y-2">
                  {step.bullets.map((bullet) => (
                    <p key={bullet} className="text-sm leading-relaxed text-ink/75 dark:text-slate-300">
                      {bullet.includes("$200 to $1,000") ? (
                        <>
                          Micro-Loans: Flexible micro-funding ranging from <span className="font-extrabold text-ocean dark:text-mint">$200 to $1,000</span> based on business scale and initial material needs.
                        </>
                      ) : bullet.includes("Growing Creative Online Marketplace") ? (
                        <>
                          <span className="font-extrabold text-ocean dark:text-mint">Growing Creative Online Marketplace</span>: Instant placement on our custom e-commerce platform, exposing finished products to regional and global buyers.
                        </>
                      ) : (
                        bullet
                      )}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

