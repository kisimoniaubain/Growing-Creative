import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Hub from "./pages/Hub";
import Fund from "./pages/Fund";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import ImpactGovernanceME from "./pages/ImpactGovernanceME";
import JoinUs from "./pages/JoinUs";
import HubFacilities from "./pages/HubFacilities";
import Newsroom from "./pages/Newsroom";
import NewsArticle from "./pages/NewsArticle";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Donate from "./pages/Donate";
import DonationSuccess from "./pages/DonationSuccess";
import DonationsAdmin from "./pages/DonationsAdmin";
import DonationsConfigAdmin from "./pages/DonationsConfigAdmin";
import AdminDashboard from "./pages/AdminDashboard";

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("sseorg-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    // Migrate legacy key used before rebrand.
    const legacyTheme = localStorage.getItem("sseyc-theme");
    if (legacyTheme === "light" || legacyTheme === "dark") return legacyTheme;
  } catch (_error) {
  }

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("dark", isDark);

    try {
      localStorage.setItem("sseorg-theme", theme);
      localStorage.removeItem("sseyc-theme");
    } catch (_error) {
    }
  }, [theme]);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(".fade-in-up"));
    if (!targets.length) return;

    targets.forEach((element) => element.classList.remove("is-visible"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="page-shell min-h-screen bg-sand text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="pt-24 lg:pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/fund" element={<Fund />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/impact-governance-me" element={<ImpactGovernanceME />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/hub-facilities" element={<HubFacilities />} />
          <Route path="/newsroom" element={<Newsroom />} />
          <Route path="/blog" element={<Newsroom />} />
          <Route path="/newsroom/:slug" element={<NewsArticle />} />
          <Route path="/blog/:slug" element={<NewsArticle />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/invest-in-youth" element={<Donate />} />
          <Route path="/donation-success" element={<DonationSuccess />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/donations" element={<DonationsAdmin />} />
          <Route path="/admin/donations-config" element={<DonationsConfigAdmin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
