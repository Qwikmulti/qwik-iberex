"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  Building2,
  Clock,
  ChevronDown,
  CheckCheck,
  X,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  source: string | null;
  createdAt: Date;
  property: { title: string; slug: string } | null;
  assignedAgent: { name: string | null; email: string } | null;
}

interface InquiriesTableProps {
  inquiries: Inquiry[];
  totalPages: number;
  currentPage: number;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "All", color: "bg-cream-100 text-ink-600" },
  { value: "NEW", label: "New", color: "bg-blue-100 text-blue-700" },
  { value: "READ", label: "Read", color: "bg-cream-200 text-ink-600" },
  {
    value: "ASSIGNED",
    label: "Assigned",
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "REPLIED",
    label: "Replied",
    color: "bg-forest-100 text-forest-700",
  },
  { value: "CLOSED", label: "Closed", color: "bg-ink-100 text-ink-500" },
];

export function InquiriesTable({
  inquiries,
  totalPages,
  currentPage,
  currentStatus,
}: InquiriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateParams = (updates: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    sp.delete("page");
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  const getStatusStyle = (status: string) => {
    return (
      STATUS_OPTIONS.find((o) => o.value === status)?.color ??
      "bg-cream-100 text-ink-600"
    );
  };

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParams({ status: opt.value })}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all border",
              currentStatus === opt.value
                ? "bg-forest-700 text-cream-50 border-forest-700"
                : "border-cream-200 text-ink-600 hover:border-forest-400",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div
        className={cn(
          "space-y-3",
          isPending && "opacity-60 pointer-events-none",
        )}
      >
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-cream-200 py-16 text-center">
            <CheckCheck size={32} className="text-forest-400 mx-auto mb-3" />
            <p className="text-ink-400 font-body">
              No inquiries in this category
            </p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={cn(
                "bg-white rounded-2xl border transition-all",
                inquiry.status === "NEW"
                  ? "border-blue-200 shadow-[0_0_0_1px_#bfdbfe]"
                  : "border-cream-200",
              )}
            >
              {/* Row */}
              <div
                className="px-5 py-4 flex items-start gap-4 cursor-pointer"
                onClick={() =>
                  setExpanded(expanded === inquiry.id ? null : inquiry.id)
                }
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-cream-50 text-sm font-bold shrink-0">
                  {inquiry.fullName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-body font-semibold text-ink-900">
                          {inquiry.fullName}
                        </p>
                        <span
                          className={cn(
                            "badge-status text-2xs",
                            getStatusStyle(inquiry.status),
                          )}
                        >
                          {inquiry.status}
                        </span>
                        {inquiry.source && (
                          <span className="badge-status bg-cream-100 text-ink-500">
                            {inquiry.source}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-xs text-ink-400">
                          <Mail size={11} /> {inquiry.email}
                        </span>
                        {inquiry.phone && (
                          <span className="flex items-center gap-1 text-xs text-ink-400">
                            <Phone size={11} /> {inquiry.phone}
                          </span>
                        )}
                      </div>
                      {inquiry.property && (
                        <span className="flex items-center gap-1 text-xs text-ink-400 mt-1">
                          <Building2 size={11} /> {inquiry.property.title}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-ink-400 flex items-center gap-1">
                        <Clock size={11} /> {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-ink-500 mt-2 line-clamp-1">
                    {inquiry.message}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={cn(
                    "text-ink-400 shrink-0 mt-1 transition-transform",
                    expanded === inquiry.id && "rotate-180",
                  )}
                />
              </div>

              {/* Expanded detail */}
              {expanded === inquiry.id && (
                <div className="px-5 pb-5 border-t border-cream-100 pt-4 space-y-4">
                  {/* Full message */}
                  <div className="bg-cream-50 rounded-xl p-4">
                    <p className="text-2xs font-body font-medium text-ink-400 uppercase tracking-wide mb-2">
                      Message
                    </p>
                    <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* Status actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-ink-400 mr-2">Update status:</p>
                    {["READ", "REPLIED", "CLOSED"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(inquiry.id, s)}
                        disabled={inquiry.status === s}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all",
                          inquiry.status === s
                            ? "bg-forest-700 text-cream-50 border-forest-700"
                            : "border-cream-200 text-ink-600 hover:border-forest-400",
                        )}
                      >
                        Mark {s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    ))}

                    <a
                      href={`mailto:${inquiry.email}?subject=Re: Your Inquiry at Iberex Estate&body=Dear ${inquiry.fullName},%0A%0A`}
                      className="ml-auto flex items-center gap-1.5 btn-primary text-xs px-4 py-2"
                    >
                      <Mail size={13} /> Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-ink-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-body disabled:opacity-40 hover:border-forest-400"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-body disabled:opacity-40 hover:border-forest-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
