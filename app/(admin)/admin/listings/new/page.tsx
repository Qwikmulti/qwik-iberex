import { prisma } from "@/lib/db/prisma";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default async function NewListingPage() {
  const [neighborhoods, amenities] = await Promise.all([
    prisma.neighborhood.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-[900px] space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-900">New Listing</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">Add a new property to the platform.</p>
      </div>
      <PropertyForm neighborhoods={neighborhoods} amenities={amenities} />
    </div>
  );
}
