import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const engagementOptions = [
  { value: "mentor", label: "Individual Master Mentor" },
  { value: "market", label: "Commercial Market Partner" },
  { value: "resource", label: "Resource & Fund Ally" },
];

const trackOptions = [
  { value: "arts", label: "Arts & Crafts (Design/Fine Arts)" },
  { value: "fashion", label: "Fashion & Design (Tailoring/Textiles)" },
  { value: "ict", label: "ICT & Digital Innovation (Dev/Tech)" },
  { value: "agriculture", label: "Sustainable Agriculture (Agri-Ventures)" },
  { value: "energy", label: "Renewable Energy (Green Infrastructure)" },
  { value: "cross-cutting", label: "Cross-Cutting Business Strategy" },
];

const pathwayCards = [
  {
    title: "1. Cohort Mentor",
    commitment: "2 to 4 hours per month during Phase 2 Incubation",
    description:
      "Provide direct one-on-one critique on business plans, refine production quality inside a selected track, and share local market insight.",
  },
  {
    title: "2. Market Partner",
    commitment: "Ongoing ecosystem alliance",
    description:
      "Open wholesale pipelines, place corporate gift orders through the SSE Marketplace, or establish contract pathways for top graduates.",
  },
  {
    title: "3. Resource Ally",
    commitment: "Structural or programmatic contribution",
    description:
      "Co-capitalize the revolving fund, sponsor track-specific software licenses, or donate specialized hardware and production equipment.",
  },
];

const initialForm = {
  fullName: "",
  email: "",
  organization: "",
  profileUrl: "",
  vector: "",
  track: "",
  brief: "",
  consent: false,
};

function normalizeProfileUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function sanitizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

function JoinUs() {
  const location = useLocation();
  const [formData, setFormData] = useState(initialForm);
  const [submittedName, setSubmittedName] = useState("");

  const preset = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const vector = params.get("vector") || "";
    const track = params.get("track") || "";

    const validVector = engagementOptions.some((item) => item.value === vector) ? vector : "";
    const validTrack = trackOptions.some((item) => item.value === track) ? track : "";

    return { validVector, validTrack };
  }, [location.search]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      vector: preset.validVector || prev.vector,
      track: preset.validTrack || prev.track,
    }));
  }, [preset.validVector, preset.validTrack]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleaned = {
      fullName: sanitizeText(formData.fullName),
      email: formData.email.trim().toLowerCase(),
      organization: sanitizeText(formData.organization),
      profileUrl: normalizeProfileUrl(formData.profileUrl),
      vector: formData.vector,
      track: formData.track,
      brief: sanitizeText(formData.brief),
      consent: formData.consent,
    };

    setSubmittedName(cleaned.fullName || "Partner");
    setFormData(initialForm);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="fade-in-up rounded-3xl border border-ocean/15 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Join Us / Mentor & Partner Network</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
          Shape the Future of Creative Enterprise
        </h1>
        <p className="mt-4 text-base text-ink/75 dark:text-slate-300 sm:text-lg">
          The SSE Innovation Hub is not built on infrastructure alone. It is powered by human capital. We invite industry leaders, seasoned creatives, and global experts to transfer their knowledge, expand our market networks, and anchor the next generation of self-employed youth.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {pathwayCards.map((pathway, index) => (
          <article key={pathway.title} className={`fade-in-up delay-${Math.min(index + 1, 3)} rounded-3xl border border-ocean/10 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900`}>
            <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">{pathway.title}</h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-ocean dark:text-mint">Commitment</p>
            <p className="mt-1 text-sm font-semibold text-ink/80 dark:text-slate-200">{pathway.commitment}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/75 dark:text-slate-300">{pathway.description}</p>
          </article>
        ))}
      </div>

      <section id="partnership-onboarding" className="fade-in-up delay-2 mt-10 rounded-3xl border border-ocean/12 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h3 className="font-display text-3xl font-extrabold text-ink dark:text-slate-100">Onboarding Submission Portal</h3>
          <p className="mt-3 text-base text-ink/65 dark:text-slate-300">
            Select your primary engagement vector. Our project management team will review your credentials and arrange an introductory alignment brief.
          </p>
        </div>

        {submittedName ? (
          <div className="rounded-2xl border border-mint/40 bg-mint/10 px-6 py-8 text-center dark:border-mint/30 dark:bg-mint/15">
            <p className="font-display text-2xl font-bold text-ink dark:text-slate-100">Thank you for stepping forward, {submittedName}.</p>
            <p className="mt-2 text-sm text-ink/75 dark:text-slate-300">Our program coordination team will reach out to you via your email within 3 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-ocean/12 bg-sand p-8 dark:border-slate-700 dark:bg-slate-800 sm:p-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g., Jane Doe"
                  className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Email Endpoint</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Current Organization / Company</label>
                <input
                  type="text"
                  name="organization"
                  required
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company Name or Independent"
                  className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Professional Profile (LinkedIn URL)</label>
                <input
                  type="url"
                  name="profileUrl"
                  value={formData.profileUrl}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/username"
                  className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Engagement Vector</label>
                <select
                  name="vector"
                  required
                  value={formData.vector}
                  onChange={handleChange}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="" disabled>Select Pathway</option>
                  {engagementOptions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Target Creative Pillar</label>
                <select
                  name="track"
                  required
                  value={formData.track}
                  onChange={handleChange}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="" disabled>Select Core Track</option>
                  {trackOptions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/80 dark:text-slate-300">Professional Brief & Core Value Addition</label>
              <textarea
                rows={4}
                name="brief"
                required
                value={formData.brief}
                onChange={handleChange}
                placeholder="Briefly outline your domain expertise and how you intend to support our youth cohorts..."
                className="w-full resize-none rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-ocean dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-ink/30 text-ocean focus:ring-ocean"
              />
              <label htmlFor="consent" className="select-none text-xs font-medium text-ink/70 dark:text-slate-300">
                I agree to dedicate the selected time commitments and authorize the SSE management board to verify my professional background.
              </label>
            </div>

            <div className="pt-2">
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-xl bg-ocean px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-ocean/90">
                Submit Partnership Application
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
}

export default JoinUs;
