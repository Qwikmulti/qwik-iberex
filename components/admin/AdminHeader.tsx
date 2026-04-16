"use client";

import { Bell, Search, Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { User } from "next-auth";

interface AdminHeaderProps {
  user: User | undefined;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-cream-200 px-6 flex items-center justify-between shrink-0">
      {/* Search */}
      <div className="relative hidden md:block w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search listings, inquiries…"
          className="w-full pl-9 pr-4 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm font-body text-ink-700 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-forest-600"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-lg text-ink-500 hover:bg-cream-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-forest-600 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-cream-200">
          <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-cream-50 text-xs font-bold">
            {user?.name ? getInitials(user.name) : "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-body font-medium text-ink-900 leading-none">{user?.name}</p>
            <p className="text-2xs text-ink-400 mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
