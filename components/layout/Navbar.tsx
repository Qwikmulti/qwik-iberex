"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Close menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[60] transition-all duration-500",
          scrolled
            ? "bg-cream-100/80 backdrop-blur-md shadow-sm py-2"
            : "bg-cream-100 py-4"
        )}
      >
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 font-display text-forest-800 text-xl font-normal tracking-tight select-none"
          >
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-cream-50 text-xs transition-transform duration-500 group-hover:rotate-[360deg]">
              IB
            </div>
            <span>
              IBEREX <span className="font-body font-medium text-xs tracking-[0.2em] text-forest-600/60">LTD</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[13px] uppercase tracking-widest font-body transition-colors duration-300",
                    active
                      ? "text-forest-900 font-semibold"
                      : "text-ink-500 hover:text-forest-800"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-forest-800"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href="/search"
              className="p-2 text-ink-600 hover:text-forest-800 transition-colors rounded-full hover:bg-forest-50"
            >
              <Search size={19} />
            </Link>
            
            <div className="hidden md:block h-6 w-px bg-forest-200/50 mx-2" />

            <Link
              href="/contact"
              className="hidden md:inline-flex bg-forest-800 text-cream-50 px-7 py-2.5 text-[11px] uppercase tracking-widest font-medium rounded-full hover:bg-forest-900 transition-all duration-300 shadow-lg shadow-forest-900/10 hover:shadow-forest-900/20 active:scale-95"
            >
              Get in Touch
            </Link>

            <button
              className="md:hidden p-2 text-ink-600 hover:text-forest-800 transition-colors relative z-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-forest-900/20 backdrop-blur-sm z-[70] md:hidden"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-cream-50 z-[80] md:hidden shadow-2xl flex flex-col pt-24 px-8 pb-10"
            >
              <div className="flex flex-col gap-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-forest-600/50 font-bold mb-2">Navigation</p>
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "block text-3xl font-display transition-all duration-300",
                          active
                            ? "text-forest-900 pl-4 border-l-2 border-forest-800"
                            : "text-ink-400 hover:text-forest-800 hover:pl-2"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto space-y-8">
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.5 }}
                >
                  <Link href="/contact" className="w-full flex items-center justify-center bg-forest-800 text-cream-50 py-5 rounded-2xl font-display text-lg shadow-xl shadow-forest-900/10">
                    Contact Us
                  </Link>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-4 pt-4 border-t border-forest-100"
                >
                  <p className="text-xs text-forest-600/50">© 2026 IBEREX LTD. Luxury Real Estate.</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
