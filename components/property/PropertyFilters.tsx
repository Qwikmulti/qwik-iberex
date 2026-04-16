"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Neighborhood } from "@prisma/client";

const PROPERTY_TYPES = [
  { label: "Detach",      value: "DETACH" },
  { label: "Semi Detach", value: "SEMI_DETACH" },
  { label: "Penthouse",   value: "PENTHOUSE" },
  { label: "Estates",     value: "ESTATE" },
];

const BED_OPTIONS   = [{ label: "Any", value: "" }, ...["1","2","3","4","5+"].map(v => ({ label: v, value: v.replace("+","") }))];
const BATH_OPTIONS  = [{ label: "Any", value: "" }, ...["1","2","3","4"].map(v => ({ label: v, value: v }))];

interface PropertyFiltersProps {
  neighborhoods: Neighborhood[];
}

export function PropertyFilters({ neighborhoods }: PropertyFiltersProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  }, [params, pathname, router]);

  const clearAll = () => {
    router.push(pathname);
  };

  const currentType = params.get("type") ?? "";
  const currentBeds = params.get("beds") ?? "";
  const hasFilters  = params.toString().length > 0;

  return (
    <div className="space-y-8">
      {/* Price range */}
      <div>
        <p className="label-overline text-ink-700 mb-3">Price Range</p>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={10000000000}
            step={100000000}
            defaultValue={params.get("maxPrice") ?? "5000000000"}
            className="w-full accent-forest-700"
            onChange={(e) => update("maxPrice", e.target.value)}
          />
          <div className="flex justify-between text-2xs text-ink-400 font-body">
            <span>N2.5M</span>
            <span>N5.0M+</span>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div>
        <p className="label-overline text-ink-700 mb-3">Specifications</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-2xs text-ink-500 font-body mb-1 block">BEDS</label>
            <select
              value={currentBeds}
              onChange={(e) => update("beds", e.target.value)}
              className="w-full input-iberex text-sm py-2 px-3"
            >
              {BED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-2xs text-ink-500 font-body mb-1 block">BATHS</label>
            <select
              value={params.get("baths") ?? ""}
              onChange={(e) => update("baths", e.target.value)}
              className="w-full input-iberex text-sm py-2 px-3"
            >
              {BATH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Property type */}
      <div>
        <p className="label-overline text-ink-700 mb-3">Property Type</p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => update("type", currentType === t.value ? "" : t.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all",
                currentType === t.value
                  ? "bg-forest-700 text-cream-50 border-forest-700"
                  : "bg-white text-ink-600 border-cream-300 hover:border-forest-400"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Neighborhood */}
      {neighborhoods.length > 0 && (
        <div>
          <p className="label-overline text-ink-700 mb-3">Neighborhood</p>
          <div className="space-y-1">
            {neighborhoods.map((hood) => (
              <button
                key={hood.id}
                onClick={() => update("neighborhood", params.get("neighborhood") === hood.slug ? "" : hood.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors",
                  params.get("neighborhood") === hood.slug
                    ? "bg-forest-50 text-forest-800 font-medium"
                    : "text-ink-600 hover:bg-cream-200"
                )}
              >
                {hood.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full py-2.5 rounded-lg bg-ink-900 text-cream-50 text-xs font-body font-medium tracking-wide hover:bg-ink-800 transition-colors"
        >
          CLEAR FILTERS
        </button>
      )}
    </div>
  );
}
