import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import homeMarketHero from "../assets/images/home-hero-download.jpg";
import homeMarketHeroAlt from "../assets/images/home-market-hero.jpg";
import hubArtsMarket from "../assets/images/hub-arts-market.jpg";
import hubFashionMarket from "../assets/images/hub-fashion-market.jpg";
import storyElectricity from "../assets/images/story-electricity.png";
import storyTailer from "../assets/images/story-tailer.png";
import storyMarchand from "../assets/images/story-marchand.png";
import whoWeAreGroupImage from "../assets/images/who-we-are-group.webp";

const stats = [
  { value: "300+", label: "Youth Recruited & Trained" },
  { value: "150+", label: "Sustainable Businesses Launched" },
  { value: "$30,000", label: "Seed Capital Distributed" },
];

const identityPoints = [
  "A youth-centered enterprise platform focused on practical job creation.",
  "A structured incubation model combining training, mentorship, and finance.",
  "A transparent ecosystem designed for both community impact and donor trust.",
];

const whatWeDoTracks = [
  {
    title: "Arts & Crafts",
    pillars: ["Graphic Design", "Fine Arts", "Local Crafts"],
    description:
      "Unleash your creative voice. This track bridges traditional heritage and modern media, teaching you how to turn visual storytelling and hands-on craftsmanship into a sustainable career.",
    accent: "border-t-ocean",
    iconTone: "bg-ocean/10 text-ocean",
    linkText: "Learn more about Arts & Crafts",
  },
  {
    title: "Fashion & Design",
    pillars: ["Tailoring", "Apparel Creation", "Modern Textile Art"],
    description:
      "Thread the needle between trend and tradition. Master advanced tailoring techniques, pattern making, and eco-friendly textile design to launch your own modern apparel brand.",
    accent: "border-t-sunrise",
    iconTone: "bg-sunrise/20 text-ink",
    linkText: "Learn more about Fashion & Design",
  },
  {
    title: "ICT & Digital Innovation",
    pillars: ["Web Development", "Digital Creation", "Tech Skills"],
    description:
      "Code the future and own your digital footprint. Learn the high-income technical skills driving today's global market, from frontend web development to creative digital content production.",
    accent: "border-t-mint",
    iconTone: "bg-mint/20 text-ocean",
    linkText: "Learn more about ICT & Digital",
  },
  {
    title: "Sustainable Agriculture",
    pillars: ["Local Value Creation", "Innovative Food Ventures"],
    description:
      "Revolutionize the way your community eats and trades. Discover smart farming technologies, learn how to build local food supply chains, and design profitable, eco-conscious agricultural businesses.",
    accent: "border-t-ocean",
    iconTone: "bg-ocean/10 text-ocean",
    linkText: "Learn more about Sustainable Ag",
  },
  {
    title: "Renewable Energy",
    pillars: ["Green Tech", "Community Power", "Energy Ventures"],
    description:
      "Power tomorrow's grid. Gain hands-on training in green technologies, solar grid maintenance, and the entrepreneurial skills required to launch decentralized, community-driven energy projects.",
    accent: "border-t-sunrise",
    iconTone: "bg-sunrise/20 text-ink",
    linkText: "Learn more about Renewable Energy",
  },
];

const heroSlides = [homeMarketHero, homeMarketHeroAlt, hubArtsMarket, hubFashionMarket];

const journeySteps = [
  {
    id: "1",
    title: "Mobilization & Training",
    summary: "Foundational technical, business, and financial training.",
  },
  {
    id: "2",
    title: "Incubation & Mentorship",
    summary: "Hub support, local coaching, and investor-ready planning.",
  },
  {
    id: "3",
    title: "Access to Finance",
    summary: "Launch capital from $200 to $1,000 through our revolving fund.",
  },
  {
    id: "4",
    title: "Market Linkages",
    summary: "SSE Online Marketplace and B2B pathways for growth.",
  },
];

const successStories = [
  {
    name: "Asha",
    title: "Community Energy Builder",
    track: "Renewable Energy Track",
    metric: "Local Households Reached: 36",
    source: "Source: Kisimoni Community Collection",
    image: storyElectricity,
    quote:
      "Before joining the Hub, I had technical interest but no roadmap for turning it into a business. Through mentorship and startup support, I now provide clean-energy services and earn consistent income while solving local power challenges.",
  },
  {
    name: "Tailer",
    title: "Founder, Tailer Studio",
    track: "Fashion & Design Track",
    metric: "Youth Employed: 3",
    source: "Source: Kisimoni Community Collection",
    image: storyTailer,
    quote:
      "I used to stitch small orders from home with no business system. The Hub helped me price properly, build a brand, and scale production with better tools. Today, my workshop serves regular clients and supports other young creatives.",
  },
  {
    name: "Marchand",
    title: "Marketplace Venture Lead",
    track: "Market Linkages",
    metric: "Products Sold Monthly: 120+",
    source: "Source: Kisimoni Community Collection",
    image: storyMarchand,
    quote:
      "Before the program, I had products but no clear route to buyers. With Hub guidance, I built stronger packaging, improved customer trust, and connected to repeat markets. My business now grows through both local and digital channels.",
  },
];

function Home() {
  const handleProposalDownload = async () => {
    const proposalPath = "/docs/SSE_Project_Proposal.pdf";
    try {
      const response = await fetch(proposalPath);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = blobUrl;
      tempLink.download = "SSE_Project_Proposal.pdf";
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (_error) {
      window.open(proposalPath, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      <section
        className="relative -mt-24 mx-auto text-white lg:-mt-28"
        style={{ width: "min(100%, 1600px)", aspectRatio: "1600 / 947" }}
      >
        <div className="hero-slider absolute inset-0" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <img
              key={slide}
              src={slide}
              alt=""
              className="hero-slide h-full w-full object-cover"
              style={{ animationDelay: `${index * 6}s` }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
            <div className="fade-in-up relative max-w-3xl">
            <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-white/18 via-white/6 to-transparent opacity-70 blur-2xl" />
            <div className="pointer-events-none absolute -inset-x-8 -bottom-8 -top-2 rounded-[2.5rem] bg-black/35 opacity-80 blur-3xl" />
            <div className="relative rounded-2xl bg-ink/36 p-4 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-6">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mint">
              Youth Innovation • Community Prosperity
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Empowering High School Graduates and Creative Youth through Creative Innovation
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
              Growing Creative transforms talent into enterprises through practical incubation, mentorship, and transparent capital access for youth aged 18-30.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/hub"
                className="rounded-xl bg-sunrise px-6 py-3 text-sm font-bold text-ink transition hover:bg-sunrise/90"
              >
                Apply as a Creative
              </Link>
              <Link
                to="/donate"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Donate Now
              </Link>
            </div>
          </div>
          </div>
          </div>

          <div className="pointer-events-none absolute bottom-2 right-3 rounded-xl bg-ink/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-mint sm:bottom-3 sm:right-4">
            Innovation Hub • K2 Z2 B7
          </div>
        </div>
      </section>

      <section className="fade-in-up delay-2 relative wave-divider-top section-pattern bg-white py-16 sm:py-20 dark:bg-slate-950">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Live Scorecard</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
                Real-Time Impact Dashboard
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-ink/60 dark:text-slate-400 md:block">
              A donor-ready transparency view of youth onboarding, enterprise launch, and financial deployment.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`fade-in-up delay-${Math.min(index + 1, 3)}`}>
                <StatCard value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fade-in-up delay-1 relative overflow-hidden border-b-[5px] border-ocean/40 dark:border-mint/35">
        <div className="relative bg-sand pb-72 pt-16 dark:bg-slate-900 sm:pb-80 sm:pt-20 lg:pb-96 lg:pt-24">
          <img
            src={whoWeAreGroupImage}
            alt=""
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full object-cover object-[center_18%] opacity-85 sm:h-72 lg:h-80"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24%, black 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 24%, black 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-sand/80 via-transparent to-black/10 sm:h-72 lg:h-80 dark:from-slate-900/80" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex rounded-full border border-ocean/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ocean dark:border-slate-600 dark:bg-slate-800 dark:text-mint">
                Who We Are
            </p>
            <h2 className="mt-5 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl dark:text-slate-100">
              Building a trusted pathway from talent to sustainable enterprise
            </h2>
            <p className="mt-5 max-w-4xl text-sm leading-relaxed text-ink/80 sm:text-base dark:text-slate-300">
              Growing Creative is a practical growth platform for young people established in 2024. Growing Creative is a forward-thinking social enterprise initiative operating out of K2 Z2 B7. We bridge the gap between education and employment by empowering unemployed secondary school graduates and naturally talented creative youth. We do not just provide job training-we cultivate innovative business owners, connect them to viable markets, and provide sustainable micro-capital.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {identityPoints.map((point) => (
              <article
                key={point}
                className="rounded-3xl border border-white/45 bg-white/88 p-5 text-center shadow-soft backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/70"
              >
                <p className="text-sm leading-6 text-ink/80 dark:text-slate-300">{point}</p>
              </article>
            ))}
          </div>
          </div>

        </div>
      </section>

      <section id="what-we-do" className="fade-in-up delay-2 bg-white py-16 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">What We Do</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-slate-100 sm:text-4xl">
              Empowering Communities Through 5 Creative Tracks
            </h2>
            <p className="mt-4 text-base text-ink/70 dark:text-slate-300 sm:text-lg">
              These vocational pathways bridge the gap between passion and sustainable economic independence, helping youth transform skills into thriving ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whatWeDoTracks.map((track, index) => (
              <article
                key={track.title}
                className={`group fade-in-up delay-${Math.min((index % 3) + 1, 3)} flex h-full flex-col justify-between rounded-2xl border border-ocean/10 border-t-4 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-ocean/35 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-mint/40 ${track.accent} ${
                  index === whatWeDoTracks.length - 1 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${track.iconTone}`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 18.5a3.5 3.5 0 0 1 3.5-3.5h1A3.5 3.5 0 0 0 13 11.5V10a3.5 3.5 0 0 1 3.5-3.5H19" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M12 5h.01M17 7h.01M7 12h.01M12 10h.01M17 12h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-ink dark:text-slate-100">{track.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {track.pillars.map((pillar) => (
                      <span key={pillar} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/75 dark:bg-slate-800 dark:text-slate-300">
                        {pillar}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-slate-300">{track.description}</p>
                </div>

                <Link to="/hub" className="mt-6 inline-flex items-center text-sm font-semibold text-ocean transition group-hover:text-ocean/90 hover:text-ocean/80 dark:text-mint dark:group-hover:text-mint dark:hover:text-mint/80">
                  {track.linkText}
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-ocean/10 bg-sand p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
            <h3 className="font-display text-2xl font-extrabold text-ink dark:text-slate-100 sm:text-3xl">Ready to find your path?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink/70 dark:text-slate-300 sm:text-base">
              Whether you are an artist, an aspiring tech founder, or a green energy pioneer, the Innovation Hub has a place for you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/hub" className="rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90">
                Explore All Programs
              </Link>
              <Link to="/contact" className="rounded-xl border border-ocean/25 bg-white px-5 py-3 text-sm font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:bg-slate-800 dark:text-mint dark:hover:bg-slate-700">
                Speak to an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="fade-in-up delay-1 relative overflow-hidden bg-sand py-16 dark:bg-slate-900 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(15,76,92,0.12),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(255,178,76,0.16),transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">How It Works</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
              From Aspiration to Enterprise: The Innovator&apos;s Journey
            </h2>
            <p className="mt-4 text-base text-ink/75 dark:text-slate-300 sm:text-lg">
              Explore our 4-step model that moves youth from foundational skills to thriving enterprises.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step, index) => (
              <article
                key={step.id}
                className={`fade-in-up delay-${Math.min(index + 1, 3)} rounded-3xl border border-ocean/10 bg-white/90 p-5 shadow-soft backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/75`}
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ocean text-sm font-extrabold text-white shadow-lg dark:bg-mint dark:text-slate-950">
                  {step.id}
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-ink dark:text-slate-100">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75 dark:text-slate-300">{step.summary}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center rounded-xl bg-ocean px-6 py-3 text-sm font-bold text-white transition hover:bg-ocean/90 dark:bg-mint dark:text-slate-950 dark:hover:bg-mint/90"
            >
              View Full 4-Step Journey
              <span className="ml-2" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="success-stories" className="fade-in-up delay-2 bg-white py-16 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Beneficiary Spotlight</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
              Stories of Impact: Meet Our Alumni
            </h2>
            <p className="mt-4 text-base text-ink/70 dark:text-slate-300 sm:text-lg">
              See how young innovators are using skills, mentorship, and seed capital from the Hub to build thriving businesses and transform their local communities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {successStories.map((story, index) => (
              <article
                key={story.name}
                className={`group fade-in-up delay-${Math.min(index + 1, 3)} overflow-hidden rounded-3xl border border-ocean/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900`}
              >
                <img
                  src={story.image}
                  alt={`${story.name} ${story.track} alumni spotlight`}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ocean/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ocean dark:bg-mint/15 dark:text-mint">
                      {story.track}
                    </span>
                    <span className="rounded-full bg-sunrise/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink dark:bg-sunrise/25 dark:text-slate-100">
                      {story.metric}
                    </span>
                  </div>

                  <div className="relative mt-4 rounded-2xl bg-sand px-4 pb-4 pt-6 dark:bg-slate-800">
                    <span className="pointer-events-none absolute left-3 top-1 select-none text-7xl font-extrabold leading-none text-ocean/15 dark:text-mint/20">
                      &ldquo;
                    </span>
                    <p className="relative z-10 text-sm leading-relaxed text-ink/80 dark:text-slate-300">{story.quote}</p>
                    <p className="mt-3 text-xs text-ink/55 dark:text-slate-400">{story.source}</p>
                  </div>

                  <div className="mt-4">
                    <p className="font-display text-xl font-bold text-ink dark:text-slate-100">{story.name}</p>
                    <p className="text-sm font-semibold text-ocean dark:text-mint">{story.title}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/hub"
              className="inline-flex items-center text-sm font-bold text-ocean transition hover:text-ocean/80 dark:text-mint dark:hover:text-mint/80"
            >
              Read More Graduate Case Studies
              <span className="ml-2" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="fade-in-up delay-3 bg-sand pb-16 dark:bg-slate-900 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-ocean/15 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-950">
            <div className="grid gap-0 lg:grid-cols-2">
              <article className="fade-in-up border-b border-ocean/10 p-7 dark:border-slate-700 lg:border-b-0 lg:border-r lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">For Youth Creatives</p>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-ink dark:text-slate-100 sm:text-3xl">
                  Are you a youth creative?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75 dark:text-slate-300 sm:text-base">
                  Applications for our next 2026 training phase are open. Turn your education and talent into a business.
                </p>
                <Link
                  to="/hub"
                  className="mt-6 inline-flex items-center rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90"
                >
                  Start Your Application
                </Link>
              </article>

              <article className="fade-in-up delay-1 p-7 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">For Impact Investors</p>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-ink dark:text-slate-100 sm:text-3xl">
                  Are you an impact investor?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75 dark:text-slate-300 sm:text-base">
                  Help us expand our $30,000 revolving fund to reach the next 300 graduates.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/donate"
                    className="inline-flex items-center rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90"
                  >
                    Donate to the Revolving Fund
                  </Link>
                  <button
                    type="button"
                    onClick={handleProposalDownload}
                    className="inline-flex items-center rounded-xl bg-sunrise px-5 py-3 text-sm font-bold text-ink transition hover:bg-sunrise/90"
                  >
                    Download Project Proposal
                  </button>
                  <Link
                    to="/contact?reason=impact-investment-partnership"
                    className="inline-flex items-center rounded-xl border border-ocean/25 bg-white px-5 py-3 text-sm font-bold text-ocean transition hover:bg-ocean/5 dark:border-slate-600 dark:bg-slate-900 dark:text-mint dark:hover:bg-slate-800"
                  >
                    Contact Us
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
