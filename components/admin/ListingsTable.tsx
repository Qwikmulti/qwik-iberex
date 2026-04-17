"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
} from "lucide-react";
import {
  cn,
  formatPrice,
  getStatusColor,
  getStatusLabel,
  formatDateShort,
} from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { PropertyForm } from "./PropertyForm";
import type { Neighborhood, Amenity } from "@prisma/client";
import { Loader2, X as CloseIcon } from "lucide-react";

interface Property {
  id: string;
  title: string;
  status: string;
  type: string;
  askingPrice: any;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  neighborhood: { name: string } | null;
  _count: { inquiries: number };
}

interface ListingsTableProps {
  properties: Property[];
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentStatus: string;
  neighborhoods: Neighborhood[];
  amenities: Amenity[];
}

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "For Sale", value: "FOR_SALE" },
  { label: "Selling Fast", value: "SELLING_FAST" },
  { label: "For Rent", value: "FOR_RENT" },
  { label: "Heritage", value: "HERITAGE" },
  { label: "New Construction", value: "NEW_CONSTRUCTION" },
  { label: "Sold", value: "SOLD" },
  { label: "Archived", value: "ARCHIVED" },
];

export function ListingsTable({
  properties,
  totalPages,
  currentPage,
  currentSearch,
  currentStatus,
  neighborhoods,
  amenities,
}: ListingsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState(currentSearch);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Edit Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);

  const handleEditClick = async (id: string) => {
    setEditingId(id);
    setIsSheetOpen(true);
    setOpenMenu(null);
    setIsLoadingProperty(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}`);
      const data = await res.json();
      setEditingProperty(data);
    } catch (error) {
      console.error("Failed to fetch property:", error);
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingId(null);
    setEditingProperty(null);
  };

  const updateParams = (updates: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    sp.delete("page");
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === properties.length) setSelected(new Set());
    else setSelected(new Set(properties.map((p) => p.id)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Archive this listing?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
  };

  return (
    <>
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-cream-100 flex flex-wrap items-center gap-3">
        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 min-w-[200px] max-w-sm"
        >
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings…"
            className="w-full pl-8 pr-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </form>

        {/* Status filter */}
        <div className="relative">
          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
          />
          <select
            value={currentStatus}
            onChange={(e) => updateParams({ status: e.target.value })}
            className="pl-8 pr-8 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-forest-600 appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-ink-500">
              {selected.size} selected
            </span>
            <button className="btn-ghost text-xs text-red-600 hover:bg-red-50">
              Archive
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-cream-100 bg-cream-50/50">
              <th className="pl-5 pr-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    selected.size === properties.length && properties.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-cream-300 accent-forest-700"
                />
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">
                Property
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">
                Status
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">
                Price
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden lg:table-cell">
                Specs
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden xl:table-cell">
                Inquiries
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden xl:table-cell">
                Added
              </th>
              <th className="px-3 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">
                Published
              </th>
              <th className="pr-5 py-3 w-12" />
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y divide-cream-100",
              isPending && "opacity-60",
            )}
          >
            {properties.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-ink-400">
                  No listings found.{" "}
                  <Link
                    href="/admin/listings/new"
                    className="text-forest-700 underline"
                  >
                    Create one →
                  </Link>
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr
                  key={property.id}
                  className={cn(
                    "hover:bg-cream-50/50 transition-colors",
                    selected.has(property.id) && "bg-forest-50/30",
                  )}
                >
                  {/* Checkbox */}
                  <td className="pl-5 pr-3 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(property.id)}
                      onChange={() => toggleSelect(property.id)}
                      className="rounded border-cream-300 accent-forest-700"
                    />
                  </td>

                  {/* Property */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden shrink-0">
                        {(property as any).coverImageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={(property as any).coverImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-ink-900 truncate max-w-[180px]">
                          {property.title}
                        </p>
                        <p className="text-xs text-ink-400">
                          {property.neighborhood?.name ?? "Abuja"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        "badge-status",
                        getStatusColor(property.status),
                      )}
                    >
                      {getStatusLabel(property.status)}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-3 py-4 font-medium text-ink-800">
                    {formatPrice(
                      Number(property.askingPrice),
                      property.currency,
                    )}
                  </td>

                  {/* Specs */}
                  <td className="px-3 py-4 text-ink-500 hidden lg:table-cell">
                    {property.bedrooms}bd · {property.bathrooms}ba ·{" "}
                    {property.sqft.toLocaleString()} ft²
                  </td>

                  {/* Inquiries */}
                  <td className="px-3 py-4 hidden xl:table-cell">
                    <span className="text-ink-600">
                      {property._count.inquiries}
                    </span>
                  </td>

                  {/* Added */}
                  <td className="px-3 py-4 text-ink-400 text-xs hidden xl:table-cell">
                    {formatDateShort(property.createdAt)}
                  </td>

                  {/* Toggle published */}
                  <td className="px-3 py-4">
                    <button
                      onClick={() =>
                        handleTogglePublish(property.id, property.published)
                      }
                      className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                        property.published ? "bg-forest-600" : "bg-cream-300",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                          property.published
                            ? "translate-x-4"
                            : "translate-x-0.5",
                        )}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="pr-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === property.id ? null : property.id,
                          )
                        }
                        className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-cream-100 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {openMenu === property.id && (
                        <div className="absolute right-0 top-8 z-10 w-40 bg-white rounded-xl border border-cream-200 shadow-lg py-1">
                          <Link
                            href={`/property/${(property as any).slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-ink-600 hover:bg-cream-50"
                          >
                            <Eye size={14} /> View Live
                          </Link>
                          <button
                            onClick={() => handleEditClick(property.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-ink-600 hover:bg-cream-50"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Archive
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-cream-100 flex items-center justify-between">
          <p className="text-xs text-ink-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-body disabled:opacity-40 hover:border-forest-400 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              className="px-3 py-1.5 rounded-lg border border-cream-200 text-xs font-body disabled:opacity-40 hover:border-forest-400 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

      {/* Edit Property Sheet */}
      <Dialog.Root open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content 
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-cream-50 z-[101] shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
            onPointerDownOutside={(e) => {
              // Prevent closing when clicking outside if form is dirty? (standard Radix behavior is fine)
            }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-white">
              <div>
                <Dialog.Title className="text-xl font-display text-ink-900">
                  {isLoadingProperty ? "Loading Listing..." : `Edit: ${editingProperty?.title ?? "Listing"}`}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-ink-400 font-body">
                  Update property details, pricing, and media assets.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button 
                  onClick={closeSheet}
                  className="p-2 rounded-lg hover:bg-cream-100 text-ink-400 transition-colors"
                >
                  <CloseIcon size={20} />
                </button>
              </Dialog.Close>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {isLoadingProperty ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-ink-400">
                  <Loader2 size={32} className="animate-spin text-forest-600" />
                  <p className="text-sm font-body">Fetching property details…</p>
                </div>
              ) : editingProperty ? (
                <PropertyForm 
                  property={editingProperty}
                  neighborhoods={neighborhoods}
                  amenities={amenities}
                  onSuccess={() => {
                    closeSheet();
                    router.refresh();
                  } }
                  onCancel={closeSheet}
                />
              ) : (
                <div className="text-center py-12 text-ink-400">
                  Failed to load property data.
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
