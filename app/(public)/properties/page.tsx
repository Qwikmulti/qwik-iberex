import type { Metadata } from "next";
import { Suspense } from "react";
import { getProperties } from "@/lib/db/properties";
import { prisma } from "@/lib/db/prisma";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertySort } from "@/components/property/PropertySort";
import { Pagination } from "@/components/shared/Pagination";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse our curated selection of architectural masterpieces and heritage estates.",
};

interface SearchParams {
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  type?: string;
  neighborhood?: string;
  status?: string;
  sort?: string;
  search?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  // Parse sort
  const sortMap: Record<string, { field: string; direction: "asc" | "desc" }> = {
    "price-high": { field: "askingPrice", direction: "desc" },
    "price-low":  { field: "askingPrice", direction: "asc" },
    "newest":     { field: "createdAt",   direction: "desc" },
    "oldest":     { field: "createdAt",   direction: "asc" },
    "sqft":       { field: "sqft",        direction: "desc" },
  };
  const sort = sortMap[params.sort ?? "price-high"] ?? sortMap["price-high"];

  const filters = {
    minPrice:          params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice:          params.maxPrice ? Number(params.maxPrice) : undefined,
    beds:              params.beds ? Number(params.beds) : undefined,
    baths:             params.baths ? Number(params.baths) : undefined,
    type:              params.type,
    neighborhoodSlug:  params.neighborhood,
    status:            params.status,
    search:            params.search,
  };

  const [{ data: properties, total, totalPages }, neighborhoods] = await Promise.all([
    getProperties(filters, page, 12, sort.field, sort.direction),
    prisma.neighborhood.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="pt-16 min-h-screen bg-cream-100">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-4">
            Homes Listing
          </h1>
          <p className="text-ink-500 font-body max-w-lg">
            A curated selection of architectural masterpieces and heritage estates,
            selected for their unique narrative and uncompromising quality.
          </p>
        </div>

        <div className="flex gap-10">
          {/* Filters sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <Suspense fallback={<div className="h-80 bg-cream-200 rounded-xl animate-pulse" />}>
              <PropertyFilters neighborhoods={neighborhoods} />
            </Suspense>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-ink-500 font-body">
                {total > 0 ? (
                  <>Showing <span className="text-ink-900 font-medium">{total}</span> properties</>
                ) : "No properties found"}
              </p>
              <PropertySort currentSort={params.sort ?? "price-high"} />
            </div>

            {/* Grid */}
            {properties.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 gap-6 mb-12">
                  {properties.map((property, i) => (
                    <PropertyCard key={property.id} property={property} priority={i < 2} />
                  ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} />
              </>
            ) : (
              <div className="text-center py-24 text-ink-400">
                <p className="font-display text-2xl mb-2">No properties found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
