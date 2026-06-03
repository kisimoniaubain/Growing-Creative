import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import orgLogo from "../assets/images/org-logo.png";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const adminKeyStorageKey = "sse-admin-donations-key";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How We Work" },
  { to: "/impact-governance-me", label: "Impact & M&E" },
  { to: "/hub", label: "Hub" },
  { to: "/contact", label: "Contact Us" },
  { to: "/fund", label: "Revolving Fund" },
  { to: "/marketplace", label: "Marketplace" },
];

const aboutMenuItems = [
  { to: "/about", label: "About" },
  { to: "/join-us", label: "Join Us" },
];

const hubMenuItems = [
  { to: "/hub", label: "Hub Overview" },
  { to: "/hub-facilities", label: "Physical Hub & Facilities" },
  { to: "/newsroom", label: "Newsroom / Field Stories" },
];

function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminUnlockError, setAdminUnlockError] = useState("");
  const [isUnlockingAdmin, setIsUnlockingAdmin] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => Boolean(sessionStorage.getItem(adminKeyStorageKey)));
  const [isAdmin] = useState(true);
  const searchInputRef = useRef(null);
  const isDark = theme === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const isAboutGroupActive = location.pathname === "/about" || location.pathname === "/join-us";
  const isHubGroupActive =
    location.pathname === "/hub" ||
    location.pathname === "/hub-facilities" ||
    location.pathname === "/newsroom" ||
    location.pathname.startsWith("/newsroom/") ||
    location.pathname === "/blog" ||
    location.pathname.startsWith("/blog/");
  const homeNavItem = navItems.find((item) => item.to === "/");
  const nonHomeNavItems = navItems.filter((item) => item.to !== "/");

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsAdminMenuOpen(false);
  }, [location.pathname]);

  const unlockAdminSession = async (event) => {
    event.preventDefault();

    const candidateKey = adminKeyInput.trim();
    if (!candidateKey) {
      setAdminUnlockError("Enter admin key to continue.");
      return;
    }

    setIsUnlockingAdmin(true);
    setAdminUnlockError("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/donations/payment-routing-summary`, {
        headers: {
          "x-admin-key": candidateKey,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Unable to validate admin key.");
      }

      sessionStorage.setItem(adminKeyStorageKey, candidateKey);
      setIsAdminUnlocked(true);
      setAdminKeyInput("");
      setIsAdminMenuOpen(false);
      navigate("/admin/dashboard");
    } catch (error) {
      setAdminUnlockError(error.message || "Unable to unlock admin session.");
    } finally {
      setIsUnlockingAdmin(false);
    }
  };

  const lockAdminSession = () => {
    sessionStorage.removeItem(adminKeyStorageKey);
    setIsAdminUnlocked(false);
    setAdminKeyInput("");
    setAdminUnlockError("");
    setIsAdminMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <Link to="/" className="fade-in-up inline-flex leading-none">
          <img src={orgLogo} alt="Growing Creative logo" className="h-[3.75rem] w-auto object-contain sm:h-[4.5rem]" />
        </Link>

        <div className="fade-in-up delay-1 flex items-center gap-2 md:hidden">
          <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? "w-40 opacity-100" : "w-0 opacity-0"}`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-ink/20 bg-white px-3 text-sm text-ink outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink dark:text-slate-100"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
            title="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink dark:text-slate-100"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <button
            className="rounded-lg border border-ink/20 p-2 text-ink dark:border-slate-600 dark:text-slate-100"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1.5 block h-0.5 w-5 bg-current" />
            <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          </button>
        </div>

        <nav className="fade-in-up delay-1 hidden items-center gap-6 md:flex">
          {homeNavItem && (
            <NavLink
              to={homeNavItem.to}
              className={({ isActive }) =>
                `fade-in-up delay-1 text-sm font-semibold transition ${
                  isActive ? "text-ocean dark:text-mint" : "text-ink/70 hover:text-ocean dark:text-slate-300 dark:hover:text-mint"
                }`
              }
            >
              {homeNavItem.label}
            </NavLink>
          )}
          <div className="relative group">
            <button
              type="button"
              className={`fade-in-up delay-1 inline-flex items-center gap-1 text-sm font-semibold transition ${
                isAboutGroupActive ? "text-ocean dark:text-mint" : "text-ink/70 hover:text-ocean dark:text-slate-300 dark:hover:text-mint"
              }`}
            >
              About
              <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-2 w-44 rounded-xl border border-ocean/10 bg-white p-2 opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900">
              {aboutMenuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-ocean/10 text-ocean dark:bg-mint/10 dark:text-mint"
                        : "text-ink/75 hover:bg-ocean/5 hover:text-ocean dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-mint"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          {nonHomeNavItems.map((item, index) => (
            item.to === "/hub" ? (
              <div key={item.to} className="relative group">
                <button
                  type="button"
                  className={`fade-in-up delay-${Math.min(index + 1, 3)} inline-flex items-center gap-1 text-sm font-semibold transition ${
                    isHubGroupActive ? "text-ocean dark:text-mint" : "text-ink/70 hover:text-ocean dark:text-slate-300 dark:hover:text-mint"
                  }`}
                >
                  Hub
                  <span aria-hidden="true">▾</span>
                </button>
                <div className="invisible absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-ocean/10 bg-white p-2 opacity-0 shadow-soft transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900">
                  {hubMenuItems.map((hubItem) => (
                    <NavLink
                      key={hubItem.to}
                      to={hubItem.to}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "bg-ocean/10 text-ocean dark:bg-mint/10 dark:text-mint"
                            : "text-ink/75 hover:bg-ocean/5 hover:text-ocean dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-mint"
                        }`
                      }
                    >
                      {hubItem.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `fade-in-up delay-${Math.min(index + 1, 3)} text-sm font-semibold transition ${
                    isActive ? "text-ocean dark:text-mint" : "text-ink/70 hover:text-ocean dark:text-slate-300 dark:hover:text-mint"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          ))}
          <div className="fade-in-up delay-2 flex items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? "w-52 opacity-100" : "w-0 opacity-0"}`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="h-10 w-full rounded-xl border border-ink/20 bg-white px-4 text-sm text-ink outline-none transition dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-ink/5 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle search"
                title="Search"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="m20 20-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <button
              onClick={onToggleTheme}
              className="fade-in-up delay-2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-ink/5 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <Link
              to="/donate"
              className="fade-in-up delay-3 rounded-xl bg-sunrise px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sunrise/90"
            >
              Donate
            </Link>
            {isAdmin && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ocean text-xs font-bold text-white shadow-soft transition hover:bg-ocean/90 dark:bg-mint dark:text-slate-900"
                  aria-haspopup="menu"
                  aria-expanded={isAdminMenuOpen}
                  aria-label="Open admin menu"
                >
                  GC
                </button>

                {isAdminMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-ocean/15 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                    {!isAdminUnlocked ? (
                      <form onSubmit={unlockAdminSession} className="space-y-2 p-1">
                        <p className="flex items-center gap-2 px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">
                          <span aria-hidden="true">🔒</span>
                          Admin Locked
                        </p>
                        <input
                          type="password"
                          value={adminKeyInput}
                          onChange={(event) => setAdminKeyInput(event.target.value)}
                          placeholder="Enter admin key"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-mint dark:focus:ring-mint/25"
                        />
                        <button
                          type="submit"
                          disabled={isUnlockingAdmin}
                          className="w-full rounded-lg bg-ocean px-3 py-2 text-sm font-semibold text-white transition hover:bg-ocean/90 disabled:opacity-70"
                        >
                          {isUnlockingAdmin ? "Unlocking..." : "Unlock Admin"}
                        </button>
                        {adminUnlockError && (
                          <p className="px-1 text-xs text-red-600 dark:text-red-300">{adminUnlockError}</p>
                        )}
                      </form>
                    ) : (
                      <div>
                        <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ocean/70 dark:text-mint/80">Admin Session</p>
                        <Link
                          to="/admin/dashboard"
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-ocean transition hover:bg-ocean/5 dark:text-mint dark:hover:bg-slate-800"
                        >
                          Control Dashboard
                        </Link>
                        <Link
                          to="/admin/donations"
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 transition hover:bg-ocean/5 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Donations Audit
                        </Link>
                        <Link
                          to="/admin/donations-config"
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 transition hover:bg-ocean/5 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Donate Config
                        </Link>
                        <button
                          type="button"
                          onClick={lockAdminSession}
                          className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink/70 transition hover:bg-ink/5 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Lock Session
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {isOpen && (
        <nav className="fade-in-up border-t border-ink/10 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-3">
            {homeNavItem && (
              <NavLink
                to={homeNavItem.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `fade-in-up delay-1 text-sm font-semibold ${isActive ? "text-ocean dark:text-mint" : "text-ink/75 dark:text-slate-300"}`
                }
              >
                {homeNavItem.label}
              </NavLink>
            )}
            {aboutMenuItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `fade-in-up delay-${Math.min(index + 1, 3)} text-sm font-semibold ${isActive ? "text-ocean dark:text-mint" : "text-ink/75 dark:text-slate-300"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {nonHomeNavItems.map((item, index) => (
              item.to === "/hub" ? (
                <div key={item.to} className="fade-in-up delay-2 flex flex-col gap-2">
                  <p className="text-sm font-semibold text-ink/75 dark:text-slate-300">Hub</p>
                  <div className="ml-3 flex flex-col gap-2 border-l border-ocean/20 pl-3 dark:border-slate-700">
                    {hubMenuItems.map((hubItem) => (
                      <NavLink
                        key={hubItem.to}
                        to={hubItem.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `text-sm font-semibold ${isActive ? "text-ocean dark:text-mint" : "text-ink/75 dark:text-slate-300"}`
                        }
                      >
                        {hubItem.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `fade-in-up delay-${Math.min(index + 1, 3)} text-sm font-semibold ${isActive ? "text-ocean dark:text-mint" : "text-ink/75 dark:text-slate-300"}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            ))}
            <Link
              to="/donate"
              onClick={() => setIsOpen(false)}
              className="fade-in-up delay-3 inline-flex w-max rounded-xl bg-sunrise px-4 py-2 text-sm font-semibold text-ink"
            >
              Donate
            </Link>
            <Link
              to="/admin/donations"
              onClick={() => setIsOpen(false)}
              className="fade-in-up delay-3 inline-flex w-max rounded-xl border border-ocean/25 px-4 py-2 text-sm font-semibold text-ocean dark:border-slate-600 dark:text-mint"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="fade-in-up delay-3 inline-flex w-max rounded-xl border border-ocean/25 px-4 py-2 text-sm font-semibold text-ocean dark:border-slate-600 dark:text-mint"
            >
              Control Dashboard
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
