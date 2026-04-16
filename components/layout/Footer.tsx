// src/components/layout/Footer.tsx
import Link from "next/link";

const SECTIONS = [
  { label: "Properties", href: "/properties" },
  { label: "Developments", href: "/properties?type=development" },
  { label: "Journal", href: "/blog" },
  { label: "Architecture", href: "/blog?category=MARKET_TRENDS" },
];

const COMPANY = [
  { label: "About Us",  href: "/about" },
  { label: "Our Team",  href: "/team" },
  { label: "Partners",  href: "/partners" },
  { label: "Contact",   href: "/contact" },
];

const FOLLOW = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn",  href: "https://linkedin.com" },
  { label: "Twitter",   href: "https://twitter.com" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="bg-ink-900 text-cream-100">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-cream-50 text-base mb-3">
              IBEREX ESTATE AND DEVELOPMENT
            </p>
            <p className="text-sm text-ink-300 leading-relaxed max-w-[220px]">
              Redefining the digital experience of luxury real estate through editorial
              precision and architectural insight.
            </p>
          </div>

          {/* Sections */}
          <div>
            <p className="label-overline text-ink-400 mb-4">Sections</p>
            <ul className="space-y-2.5">
              {SECTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-300 hover:text-cream-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="label-overline text-ink-400 mb-4">Company</p>
            <ul className="space-y-2.5">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-300 hover:text-cream-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <p className="label-overline text-ink-400 mb-4">Follow</p>
            <ul className="space-y-2.5">
              {FOLLOW.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-300 hover:text-cream-50 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} IBEREX LTD. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-ink-500 hover:text-ink-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
