import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getPropertyForAdminEdit } from "@/lib/db/properties";
import { PropertyForm } from "@/components/admin/PropertyForm";

interface EditParams {
  id: string;
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<EditParams>;
}) {
  const { id } = await params;

  const [property, neighborhoods, amenities] = await Promise.all([
    getPropertyForAdminEdit(id),
    prisma.neighborhood.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.amenity.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-[900px] space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Edit Listing</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">
          Update property details and media.
        </p>
      </div>
      <PropertyForm
        property={property}
        neighborhoods={neighborhoods}
        amenities={amenities}
      />
    </div>
  );
}
