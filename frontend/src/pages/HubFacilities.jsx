import { Link } from "react-router-dom";
import hubIctMarket from "../assets/images/hub-ict-market.jpg";
import hubFashionMarket from "../assets/images/hub-fashion-market.jpg";
import hubArtsMarket from "../assets/images/hub-arts-market.jpg";
import hubAgriMarket from "../assets/images/hub-agri-market.jpg";

const facilityAreas = [
  {
    title: "Computer Lab",
    image: hubIctMarket,
    description: "Digital skills lab for coding, design, online freelancing, and e-commerce operations.",
    tools: ["Desktop workstations", "Reliable internet", "Design software", "Projector + screen"],
  },
  {
    title: "Tailoring Workshop",
    image: hubFashionMarket,
    description: "Hands-on production room for garment training, prototyping, and small-batch production.",
    tools: ["Industrial sewing machines", "Cutting tables", "Pressing kits", "Measurement sets"],
  },
  {
    title: "Crafting Studio",
    image: hubArtsMarket,
    description: "Creative space for local crafts, product finishing, branding, and market-ready packaging.",
    tools: ["Craft benches", "Hand tools", "Storage shelving", "Packaging station"],
  },
  {
    title: "Meeting & Mentorship Room",
    image: hubAgriMarket,
    description: "Safe collaboration room for coaching sessions, investor meetings, and donor briefings.",
    tools: ["Workshop seating", "Presentation wall", "Whiteboard", "Audio setup"],
  },
];

const budgetLines = [
  { label: "Core Equipment Procurement", amount: 6200, width: "41%" },
  { label: "Power, Safety, and Connectivity", amount: 2900, width: "19%" },
  { label: "Workshop Furniture and Fit-Out", amount: 3500, width: "23%" },
  { label: "Training Materials and Starter Kits", amount: 2400, width: "16%" },
];

const walkthroughSteps = [
  "Entry and safety checkpoint",
  "Digital lab and workstation zone",
  "Tailoring and production workbench area",
  "Craft and finishing studio",
  "Mentorship room and donor briefing corner",
];

const virtualTourEmbedUrl =
  import.meta.env.VITE_HUB_TOUR_VIDEO_URL || "https://player.vimeo.com/video/76979871";

function HubFacilities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="fade-in-up rounded-3xl border border-ocean/15 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">
          Physical Hub & Facilities
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
          Virtual Tour of the Youth Innovation and Creativity Hub
        </h1>
        <p className="mt-4 max-w-3xl text-base text-ink/70 dark:text-slate-300">
          This page documents the real operating environment of our center at K2 Z2 B7, Mombasa. Donors and
          partners can verify the physical setup, safety readiness, and active equipment purchased through the
          $15,000 facility setup budget.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="fade-in-up delay-1 rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Location</p>
            <p className="mt-2 text-lg font-bold text-ink dark:text-slate-100">K2 Z2 B7</p>
            <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">Head office and training center</p>
          </article>
          <article className="fade-in-up delay-1 rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Safety</p>
            <p className="mt-2 text-lg font-bold text-ink dark:text-slate-100">Verified</p>
            <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">Power, fire, and entry controls in place</p>
          </article>
          <article className="fade-in-up delay-2 rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Training Capacity</p>
            <p className="mt-2 text-lg font-bold text-ink dark:text-slate-100">80+ Youth / Cycle</p>
            <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">Multi-track sessions every week</p>
          </article>
          <article className="fade-in-up delay-2 rounded-2xl border border-ocean/10 bg-sand p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Facility Setup Budget</p>
            <p className="mt-2 text-lg font-bold text-ink dark:text-slate-100">$15,000</p>
            <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">Allocated and tracked by line item</p>
          </article>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {facilityAreas.map((area, index) => (
          <article
            key={area.title}
            className={`fade-in-up delay-${Math.min((index % 3) + 1, 3)} overflow-hidden rounded-3xl border border-ocean/12 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900`}
          >
            <img src={area.image} alt={`${area.title} at Growing Creative facility`} className="h-52 w-full object-cover" />
            <div className="p-6">
              <h2 className="font-display text-xl font-bold text-ink dark:text-slate-100">{area.title}</h2>
              <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">{area.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {area.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean dark:bg-mint/15 dark:text-mint">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <article className="fade-in-up mt-10 overflow-hidden rounded-3xl border border-ocean/15 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-ocean/10 px-6 py-5 dark:border-slate-700 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Embedded Virtual Tour</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink dark:text-slate-100">Video Walkthrough of the Hub Spaces</h2>
          <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">
            The walkthrough below provides visual proof of the facility setup. Replace with your official video by
            setting VITE_HUB_TOUR_VIDEO_URL in your frontend environment.
          </p>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            title="Growing Creative Hub Virtual Tour"
            src={virtualTourEmbedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </article>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="fade-in-up rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">$15,000 Facility Setup Breakdown</h2>
          <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">
            Transparent allocation for tools, safety readiness, and practical infrastructure used by trainees.
          </p>

          <div className="mt-6 space-y-4">
            {budgetLines.map((line, index) => (
              <div key={line.label} className={`fade-in-up delay-${Math.min(index + 1, 3)}`}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm font-semibold text-ink dark:text-slate-200">
                  <span>{line.label}</span>
                  <span>${line.amount.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-ocean/10 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-ocean dark:bg-mint" style={{ width: line.width }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="fade-in-up delay-1 rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Virtual Walkthrough Sequence</h2>
          <p className="mt-2 text-sm text-ink/70 dark:text-slate-300">
            A guided visual path donors can use to verify the full facility setup from entry to training zones.
          </p>

          <ol className="mt-5 space-y-3">
            {walkthroughSteps.map((step, index) => (
              <li key={step} className={`fade-in-up delay-${Math.min(index + 1, 3)} flex items-start gap-3 rounded-2xl bg-sand px-4 py-3 text-sm text-ink/80 dark:bg-slate-800 dark:text-slate-200`}>
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ocean text-xs font-bold text-white dark:bg-mint dark:text-ink">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <Link
            to="/contact?reason=impact-investment-partnership"
            className="mt-6 inline-flex items-center rounded-xl bg-sunrise px-5 py-3 text-sm font-bold text-ink transition hover:bg-sunrise/90"
          >
            Request Live Guided Tour
          </Link>
        </article>
      </div>
    </section>
  );
}

export default HubFacilities;
