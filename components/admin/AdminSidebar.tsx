"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, FileText, MessageSquare,
  Image, Users, Settings, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",    href: "/admin" },
      { icon: Building2,       label: "Listings",     href: "/admin/listings" },
      { icon: FileText,        label: "Blog Posts",   href: "/admin/blog" },
      { icon: MessageSquare,   label: "Inquiries",    href: "/admin/inquiries" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Image,   label: "Media Library", href: "/admin/media" },
      { icon: Users,   label: "Users",         href: "/admin/users" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-ink-950 text-cream-100 border-r border-ink-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-ink-800">
        <Link href="/" className="block">
          <p className="font-display text-cream-50 text-sm">IBEREX <span className="font-body font-medium tracking-widest text-xs">LTD</span></p>
          <p className="text-2xs text-ink-400 font-body mt-0.5">Admin Dashboard</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="label-overline text-ink-600 px-3 mb-2">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map(({ icon: Icon, label, href }) => {
                const active = href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all group",
                        active
                          ? "bg-forest-700 text-cream-50"
                          : "text-ink-300 hover:bg-ink-800 hover:text-cream-100"
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="flex-1">{label}</span>
                      {active && <ChevronRight size={13} className="opacity-60" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-ink-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-body text-ink-400 hover:bg-ink-800 hover:text-cream-100 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
