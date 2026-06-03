import { Link } from "react-router-dom";
import orgLogo from "../assets/images/org-logo.png";

const footerNavItems = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/impact-governance-me", label: "Impact & M&E" },
  { to: "/about", label: "About" },
  { to: "/join-us", label: "Join Us" },
  { to: "/contact", label: "Contact" },
  { to: "/hub", label: "The Hub" },
  { to: "/hub-facilities", label: "Physical Hub & Facilities" },
  { to: "/newsroom", label: "Newsroom / Field Stories" },
  { to: "/fund", label: "Revolving Fund" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", iconClass: "fa-brands fa-facebook-f" },
  { href: "https://instagram.com", label: "Instagram", iconClass: "fa-brands fa-instagram" },
  { href: "https://x.com", label: "X", iconClass: "fa-brands fa-x-twitter" },
  { href: "https://linkedin.com", label: "LinkedIn", iconClass: "fa-brands fa-linkedin-in" },
  { href: "https://youtube.com", label: "YouTube", iconClass: "fa-brands fa-youtube" },
];

function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-ocean/10 bg-white text-ink dark:border-slate-700 dark:bg-ink dark:text-white">
      <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ backgroundImage: "linear-gradient(120deg, var(--brand-mint) 0%, transparent 40%, var(--brand-sunrise) 100%)" }} />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="fade-in-up">
          <Link to="/" className="inline-flex leading-none">
            <img src={orgLogo} alt="Growing Creative logo" className="h-12 w-auto object-contain sm:h-14" />
          </Link>
        </div>
        <div className="fade-in-up delay-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean dark:text-mint">Quick Links</p>
          <div className="mt-3 grid gap-2">
            {footerNavItems.map((item, index) => (
              <Link key={item.to} to={item.to} className={`fade-in-up delay-${Math.min(index + 1, 3)} text-sm text-ink/70 transition hover:text-ocean dark:text-white/75 dark:hover:text-mint`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="fade-in-up delay-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean dark:text-mint">Head Office</p>
          <p className="mt-2 text-sm text-ink/70 dark:text-white/75">K2 Z2 B7 Innovation Hub</p>
          <p className="text-sm text-ink/70 dark:text-white/75">Established 2025</p>
        </div>
        <div className="fade-in-up delay-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean dark:text-mint">Impact Focus</p>
          <p className="mt-2 text-sm text-ink/70 dark:text-white/75">Youth Employment</p>
          <p className="text-sm text-ink/70 dark:text-white/75">Creative Enterprise Incubation</p>
          <p className="text-sm text-ink/70 dark:text-white/75">Transparent Donor Reporting</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ocean dark:text-mint">Social Media</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {socialLinks.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className={`fade-in-up delay-${Math.min((index % 3) + 1, 3)} inline-flex h-9 w-9 items-center justify-center rounded-full border border-ocean/20 text-ink/80 transition hover:border-ocean hover:text-ocean dark:border-slate-600 dark:text-white/80 dark:hover:border-mint dark:hover:text-mint`}
              >
                <i className={`${item.iconClass} text-sm`} aria-hidden="true" />
                <span className="sr-only">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
