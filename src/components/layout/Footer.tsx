import { Link, useNavigate } from "react-router-dom";
import { Compass, Mail, Phone, MapPin, Instagram, Twitter, Youtube } from "lucide-react";

/** Scrolls to a section on the landing page — works from any page */
function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function HashLink({ href, children }: { href: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  const sectionId = href.replace("/#", "");

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        // If on landing page, scroll directly
        if (window.location.pathname === "/") {
          scrollToSection(sectionId);
        } else {
          // Navigate to landing page first, then scroll after render
          navigate("/");
          setTimeout(() => scrollToSection(sectionId), 100);
        }
      }}
      className="text-sm text-text-secondary hover:text-accent transition-colors duration-200 cursor-pointer"
    >
      {children}
    </a>
  );
}

const footerLinks = {
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Explore Tours", href: "/tours" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Contact", href: "/#contact" },
  ],
  tours: [
    { label: "Popular Tours", href: "/#tours" },
    { label: "All Destinations", href: "/tours" },
    { label: "Short Trips", href: "/tours" },
    { label: "Compare Destinations", href: "/compare" },
  ],
  support: [
    { label: "Contact Us", href: "/#contact" },
    { label: "FAQs", href: "/tours" },
    { label: "Booking Guide", href: "/tours" },
    { label: "Terms & Conditions", href: "/tours" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border-light bg-surface">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <Compass className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold">
                Travel<span className="text-accent">Log</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-sm">
              Discover breathtaking destinations, create unforgettable memories,
              and explore the world with our expertly curated travel experiences.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail className="w-4 h-4 text-accent" />
                <span>hello@travellog.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 1800-TRAVEL</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">
                {key}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/#") ? (
                      <HashLink href={link.href}>{link.label}</HashLink>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border-light">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} TravelLog. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
