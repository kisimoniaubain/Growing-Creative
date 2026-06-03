import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const inquiryReasons = [
  "General Inquiry",
  "Youth Application Support",
  "Impact Investment / Partnership",
  "Program Collaboration",
  "Media / Press",
];

const reasonParamMap = {
  "impact-investment-partnership": "Impact Investment / Partnership",
};

const buildInitialContact = (reason = "General Inquiry") => ({
  fullName: "",
  email: "",
  organization: "",
  reason,
  message: "",
});

const officeLocation = "Kenya/Turkana County/Kakuma";
const mapEmbedUrl = "https://www.google.com/maps?q=Kakuma%2C%20Turkana%20County%2C%20Kenya&output=embed";
const directionsUrl = "https://www.google.com/maps/search/Kakuma%2C+Turkana+County%2C+Kenya";

function Contact() {
  const location = useLocation();
  const preferredReason = useMemo(() => {
    const rawReason = new URLSearchParams(location.search).get("reason");
    if (!rawReason) return "General Inquiry";
    return reasonParamMap[rawReason] || "General Inquiry";
  }, [location.search]);

  const [formData, setFormData] = useState(() => buildInitialContact(preferredReason));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, reason: preferredReason }));
  }, [preferredReason]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData(buildInitialContact(preferredReason));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="fade-in-up rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Contact Growing Creative</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
            Let Us Build Youth Enterprise Together
          </h1>
          <p className="mt-4 text-ink/70 dark:text-slate-300">
            Reach out for youth applications, donor partnerships, implementation collaboration, and social enterprise support opportunities.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="fade-in-up delay-1 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wide text-ink/60 dark:text-slate-400">Head Office</p>
              <p className="mt-2 font-semibold text-ink dark:text-slate-100">{officeLocation}</p>
            </div>
            <div className="fade-in-up delay-2 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wide text-ink/60 dark:text-slate-400">Email</p>
              <p className="mt-2 font-semibold text-ink dark:text-slate-100">sse@gmail.com</p>
            </div>
            <div className="fade-in-up delay-2 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wide text-ink/60 dark:text-slate-400">Phone</p>
              <p className="mt-2 font-semibold text-ink dark:text-slate-100">+254 798 406 723</p>
            </div>
            <div className="fade-in-up delay-3 rounded-2xl border border-ocean/10 bg-sand p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-wide text-ink/60 dark:text-slate-400">Office Hours</p>
              <p className="mt-2 font-semibold text-ink dark:text-slate-100">Mon - Fri, 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </article>

        <article className="fade-in-up delay-1 rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Send a Message</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-slate-400">Our team responds within 1 to 2 business days.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="organization" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Organization (Optional)
              </label>
              <input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Company, NGO, Institution"
              />
            </div>
            <div>
              <label htmlFor="reason" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Reason for Inquiry
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                {inquiryReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Tell us how you would like to work with Growing Creative."
              />
            </div>

            {submitted && (
              <p className="rounded-lg bg-mint/15 px-3 py-2 text-sm text-ocean dark:bg-mint/20 dark:text-mint">
                Thank you. Your message has been received.
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90"
            >
              Send Message
            </button>
          </form>
        </article>
      </div>

      <article className="fade-in-up delay-2 mt-8 overflow-hidden rounded-3xl border border-ocean/10 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-5">
        <div className="mb-4 flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Location Map</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink dark:text-slate-100">Find Our Office</h2>
          <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">Visit the Growing Creative coordination hub shown below.</p>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-ocean px-4 py-3 text-sm font-semibold text-white transition hover:bg-ocean/90"
          >
            Get Directions
          </a>
        </div>
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-sand px-4 py-3 dark:bg-slate-800">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sunrise/20 text-sunrise dark:bg-sunrise/25 dark:text-sunrise">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean dark:text-mint">Pinned Office Location</p>
            <p className="mt-1 text-sm font-semibold text-ink dark:text-slate-100">{officeLocation}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-sunrise shadow-lg dark:bg-slate-900/95 dark:text-sunrise">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
            Your Growing Creative location
          </div>
          <iframe
            title="Growing Creative office map"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full rounded-2xl border-0 sm:h-96"
          />
        </div>
      </article>
    </section>
  );
}

export default Contact;
