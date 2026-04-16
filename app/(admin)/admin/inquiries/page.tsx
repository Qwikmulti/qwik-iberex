import { getInquiriesAdmin } from "@/lib/db/inquiries";
import { InquiriesTable } from "@/components/admin/InquiriesTable";

interface SearchParams { page?: string; status?: string; }

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page   = parseInt(params.page ?? "1");

  const { data, total, totalPages } = await getInquiriesAdmin(
    page, 20, params.status
  );

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Inquiries</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">{total} total inquiries</p>
      </div>

      <InquiriesTable
        inquiries={data as any}
        totalPages={totalPages}
        currentPage={page}
        currentStatus={params.status ?? ""}
      />
    </div>
  );
}
