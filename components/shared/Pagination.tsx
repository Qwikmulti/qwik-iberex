"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(page));
    router.push(`${pathname}?${sp.toString()}`);
  };

  // Build page numbers with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-cream-300 text-ink-500 hover:border-forest-400 hover:text-forest-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-ink-400 text-sm px-1">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-body font-medium transition-all border",
              p === currentPage
                ? "bg-forest-700 text-cream-50 border-forest-700"
                : "border-cream-300 text-ink-600 hover:border-forest-400 hover:text-forest-700"
            )}
          >
            {String(p).padStart(2, "0")}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-cream-300 text-ink-500 hover:border-forest-400 hover:text-forest-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
