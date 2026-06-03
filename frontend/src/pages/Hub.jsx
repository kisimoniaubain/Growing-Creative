import { useState } from "react";
import hubArtsMarket from "../assets/images/hub-arts-market.jpg";
import hubFashionMarket from "../assets/images/hub-fashion-market.jpg";
import hubIctMarket from "../assets/images/hub-ict-market.jpg";
import hubAgriMarket from "../assets/images/hub-agri-market.jpg";
import hubEnergyMarket from "../assets/images/hub-energy-market.jpg";

const tracks = [
  "Arts",
  "Fashion",
  "ICT",
  "Agriculture",
  "Renewable Energy",
];

const trackImages = {
  Arts: hubArtsMarket,
  Fashion: hubFashionMarket,
  ICT: hubIctMarket,
  Agriculture: hubAgriMarket,
  "Renewable Energy": hubEnergyMarket,
};

const initialState = {
  name: "",
  age: "",
  email: "",
  trainingTrack: tracks[0],
  businessIdea: "",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Hub() {
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const age = Number(formData.age);
    if (Number.isNaN(age) || age < 18 || age > 30) {
      setIsError(true);
      setMessage("Age must be between 18 and 30 years.");
      return;
    }

    if (formData.businessIdea.trim().length < 30) {
      setIsError(true);
      setMessage("Business Idea Abstract should be at least 30 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age,
          email: formData.email,
          trainingTrack: formData.trainingTrack,
          businessIdeaAbstract: formData.businessIdea,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed.");
      }

      setIsError(false);
      setMessage("Application submitted successfully. Our team will contact you shortly.");
      setFormData(initialState);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="fade-in-up">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">The Incubation Hub</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">
            From Talent to Enterprise in 5 Specialized Tracks
          </h1>
          <p className="mt-4 text-base text-ink/70 dark:text-slate-300">
            At Growing Creative, youth receive practical guidance, modern tools, and milestone-based support to build resilient ventures and create local jobs.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {tracks.map((track, index) => (
              <article key={track} className={`fade-in-up delay-${Math.min((index % 3) + 1, 3)} overflow-hidden rounded-2xl border border-ocean/10 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900`}>
                <img
                  src={trackImages[track]}
                  alt={`${track} business activity by African youth entrepreneurs`}
                  className="h-32 w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-display text-lg font-bold text-ocean dark:text-mint">{track}</p>
                  <p className="mt-2 text-sm text-ink/65 dark:text-slate-400">Project showcase area for real trainee activities and outcomes.</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="fade-in-up delay-1 rounded-3xl border border-ocean/15 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-slate-100">Youth Application Form</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-slate-400">Eligibility: Secondary school graduates aged 18-30.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="30"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="18-30"
                />
              </div>
              <div>
                <label htmlFor="trainingTrack" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                  Preferred Track
                </label>
                <select
                  id="trainingTrack"
                  name="trainingTrack"
                  value={formData.trainingTrack}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  {tracks.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Email Address
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
              <label htmlFor="businessIdea" className="text-sm font-semibold text-ink/80 dark:text-slate-300">
                Business Idea Abstract
              </label>
              <textarea
                id="businessIdea"
                name="businessIdea"
                rows={5}
                value={formData.businessIdea}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-mint dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Summarize your business idea, your product/service, and who it will serve."
              />
            </div>

            {message && (
              <p className={`rounded-lg px-3 py-2 text-sm ${isError ? "bg-sunrise/20 text-ocean dark:bg-sunrise/25 dark:text-sunrise" : "bg-mint/15 text-ocean dark:bg-mint/20 dark:text-mint"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Hub;
