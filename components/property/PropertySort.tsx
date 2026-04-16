"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Price: High to Low", value: "price-high" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Newest First",       value: "newest" },
  { label: "Largest First",      value: "sqft" },
];

export function PropertySort({ currentSort }: { currentSort: string }) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const handleChange = (value: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("sort", value);
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  };

  const current = SORT_OPTIONS.find((o) => o.value === currentSort);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink-400 font-body">SORT BY</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-cream-300 rounded-lg text-sm font-body text-ink-700 focus:outline-none focus:ring-2 focus:ring-forest-600 cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
      </div>
    </div>
  );
}
