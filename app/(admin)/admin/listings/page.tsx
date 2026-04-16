import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPropertiesAdmin } from "@/lib/db/properties";
import { ListingsTable } from "@/components/admin/ListingsTable";

interface SearchParams { page?: string; search?: string; status?: string; }

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page   = parseInt(params.page ?? "1");

  const { data, total, totalPages } = await getAllPropertiesAdmin(
    page, 20, params.search, params.status
  );

  return (
    <div className="space-y-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Listings</h1>
          <p className="text-sm text-ink-400 mt-1 font-body">{total} total properties</p>
        </div>
        <Link href="/admin/listings/new" className="btn-primary text-sm">
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {/* Table */}
      <ListingsTable
        properties={data as any}
        totalPages={totalPages}
        currentPage={page}
        currentSearch={params.search ?? ""}
        currentStatus={params.status ?? ""}
      />
    </div>
  );
}
