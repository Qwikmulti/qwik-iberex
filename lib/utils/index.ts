import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency = "NGN"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;

  if (currency === "NGN") {
    if (num >= 1_000_000_000) return `₦${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`;
    return `₦${num.toLocaleString()}`;
  }

  if (currency === "USD") {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  }

  return `${currency} ${num.toLocaleString()}`;
}

export function formatPriceFull(price: number | string, currency = "NGN"): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  const symbol = currency === "NGN" ? "₦" : "$";

  return `${symbol}${num.toLocaleString("en-NG")}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE:           "bg-forest-100 text-forest-800",
    FOR_SALE:         "bg-blue-100 text-blue-800",
    SELLING_FAST:     "bg-amber-100 text-amber-800",
    FOR_RENT:         "bg-purple-100 text-purple-800",
    HERITAGE:         "bg-orange-100 text-orange-800",
    NEW_CONSTRUCTION: "bg-emerald-100 text-emerald-800",
    SOLD:             "bg-gray-100 text-gray-600",
    ARCHIVED:         "bg-gray-100 text-gray-400",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "Active",
    FOR_SALE: "For Sale",
    SELLING_FAST: "Selling Fast",
    FOR_RENT: "For Rent",
    HERITAGE: "Heritage",
    NEW_CONSTRUCTION: "New Construction",
    SOLD: "Sold",
    ARCHIVED: "Archived",
  };
  return map[status] ?? status;
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${path}`;
}
