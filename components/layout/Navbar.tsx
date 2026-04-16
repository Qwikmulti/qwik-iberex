"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Blog",       href: "/blog" },
  { label: "Contact",    href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const id = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [pathname, mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream-100/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,.06)]"
          : "bg-cream-100"
      )}
    >
      <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-forest-800 text-lg font-normal tracking-tight select-none"
        >
          IBEREX <span className="font-body font-medium text-sm tracking-widest">LTD</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-body transition-colors duration-200",
                  active
                    ? "text-ink-900 font-medium after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-ink-900 after:rounded-full"
                    : "text-ink-600 hover:text-ink-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="p-2 text-ink-600 hover:text-ink-900 transition-colors rounded-lg hover:bg-ink-50"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/contact"
            className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5"
          >
            Inquire
          </Link>
          <button
            className="md:hidden p-2 text-ink-600 hover:text-ink-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out-expo bg-cream-100 border-t border-cream-200",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                  active
                    ? "bg-forest-50 text-forest-800 font-medium"
                    : "text-ink-700 hover:bg-ink-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary mt-3 text-center text-sm">
            Inquire
          </Link>
        </div>
      </div>
    </header>
  );
}
