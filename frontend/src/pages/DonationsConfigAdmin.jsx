import { useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const adminKeyStorageKey = "sse-admin-donations-key";

function normalizeProgramsInput(programText) {
  const lines = programText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line, index) => {
      const [title = "", amount = "", summary = ""] = line.split("|").map((part) => part.trim());
      return {
        key: `program-${index + 1}`,
        title,
        amount: Number(amount),
        summary,
      };
    })
    .filter((program) => program.title && Number.isFinite(program.amount) && program.amount > 0 && program.summary);
}

function DonationsConfigAdmin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(adminKeyStorageKey) || "");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [monthlyProgramsInput, setMonthlyProgramsInput] = useState("");
  const [oneTimeTiersInput, setOneTimeTiersInput] = useState("50,250,500,1500");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoad = async (event) => {
    event.preventDefault();
    if (!adminKey.trim()) {
      setErrorMessage("Enter admin passcode first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/donations/config`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to load donation config.");
      }

      setHeroHeadline(payload.hero?.headline || "");
      setHeroSubheadline(payload.hero?.subheadline || "");
      setMonthlyProgramsInput(
        (payload.monthlyPrograms || [])
          .map((program) => `${program.title} | ${program.amount} | ${program.summary}`)
          .join("\n")
      );
      setOneTimeTiersInput((payload.oneTimeTiers || []).join(","));
      sessionStorage.setItem(adminKeyStorageKey, adminKey.trim());
      setStatusMessage("Configuration loaded. Edit and click Save Configuration.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to load configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!adminKey.trim()) {
      setErrorMessage("Enter admin passcode first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const monthlyPrograms = normalizeProgramsInput(monthlyProgramsInput);
      const oneTimeTiers = oneTimeTiersInput
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0);

      const response = await fetch(`${apiBaseUrl}/api/donations/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          hero: {
            headline: heroHeadline,
            subheadline: heroSubheadline,
          },
          monthlyPrograms,
          oneTimeTiers,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Failed to update configuration.");
      }

      sessionStorage.setItem(adminKeyStorageKey, adminKey.trim());
      setStatusMessage("Donation configuration saved successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to save configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-3xl border border-ocean/15 bg-white p-7 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean/70 dark:text-mint/80">Admin Donate Configuration</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-slate-100 sm:text-4xl">Edit Donate Page Tiers</h1>
        <p className="mt-3 text-sm text-ink/70 dark:text-slate-300">
          Format monthly rows as: <span className="font-semibold">Title | Amount | Summary</span> (one per line).
        </p>

        <form onSubmit={handleLoad} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="Admin passcode"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean/90 disabled:opacity-70"
          >
            {isLoading ? "Loading..." : "Load Current Config"}
          </button>
        </form>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Hero Headline</label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(event) => setHeroHeadline(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Hero Subheadline</label>
            <textarea
              rows={4}
              value={heroSubheadline}
              onChange={(event) => setHeroSubheadline(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">Monthly Programs</label>
            <textarea
              rows={6}
              value={monthlyProgramsInput}
              onChange={(event) => setMonthlyProgramsInput(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-ocean/70 dark:text-mint/80">One-Time Tiers (comma separated)</label>
            <input
              type="text"
              value={oneTimeTiersInput}
              onChange={(event) => setOneTimeTiersInput(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-sunrise px-5 py-3 text-sm font-bold text-ink transition hover:bg-sunrise/90 disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </button>
        </form>

        {statusMessage && (
          <p className="mt-5 rounded-xl border border-mint/30 bg-mint/15 px-4 py-3 text-sm text-ocean dark:border-mint/20 dark:bg-mint/10 dark:text-mint">
            {statusMessage}
          </p>
        )}

        {errorMessage && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}

export default DonationsConfigAdmin;
