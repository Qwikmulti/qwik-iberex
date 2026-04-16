import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, CheckCircle2 } from "lucide-react";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/db/properties";
import { PropertyCard } from "@/components/property/PropertyCard";
import { TourRequestForm } from "@/components/property/TourRequestForm";
import { formatPriceFull, getStatusLabel, getStatusColor, cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: property.title,
    description: property.tagline ?? property.description.slice(0, 160),
    openGraph: {
      images: property.coverImageUrl ? [property.coverImageUrl] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = await getRelatedProperties(
    property.id,
    property.neighborhoodId,
    3
  );

  const coverImage  = property.images.find((i) => i.isCover) ?? property.images[0];
  const sideImages  = property.images.filter((i) => !i.isCover).slice(0, 2);
  const amenities   = property.amenities.map((a) => a.amenity);

  return (
    <div className="pt-16">
      {/* ─── Gallery ─────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-1 max-h-[600px] overflow-hidden">
        {/* Main image */}
        <div className="relative aspect-[4/3] md:aspect-auto bg-cream-200 group">
          {coverImage?.url || property.coverImageUrl ? (
            <>
              <Image
                src={coverImage?.url ?? property.coverImageUrl!}
                alt={coverImage?.altText ?? property.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/60 backdrop-blur-sm text-cream-200 text-xs font-body px-3 py-1.5 rounded-lg tracking-wide">
                  MAIN PAVILION
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-cream-200" />
          )}
        </div>

        {/* Side images */}
        <div className="hidden md:flex flex-col gap-1">
          {sideImages.map((img, i) => (
            <div key={img.id} className="relative flex-1 overflow-hidden bg-cream-300">
              <Image
                src={img.url}
                alt={img.altText ?? `${property.title} ${i + 2}`}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          ))}
          {/* Placeholder if fewer than 2 side images */}
          {Array.from({ length: Math.max(0, 2 - sideImages.length) }).map((_, i) => (
            <div key={`ph-${i}`} className="flex-1 bg-cream-200" />
          ))}
        </div>
      </section>

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16">
          {/* Left column */}
          <div>
            {/* Location + Title */}
            <div className="mb-8">
              <p className="label-overline text-forest-600 mb-2">
                Exclusive Listing ·{" "}
                {property.neighborhood ? `${property.neighborhood.name}, Abuja` : property.city}
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-ink-900 mb-4">
                {property.title}
              </h1>
              {property.tagline && (
                <p className="text-ink-500 font-body text-lg leading-relaxed max-w-xl">
                  {property.tagline}
                </p>
              )}
            </div>

            {/* Narrative */}
            {property.narrative && (
              <div className="mb-12">
                <h2 className="font-display text-2xl text-ink-900 mb-5">
                  Architectural Narrative
                </h2>
                <div className="space-y-4 text-ink-600 font-body leading-relaxed">
                  {property.narrative.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-12">
                <p className="label-overline text-ink-500 mb-5">Signature Amenities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 p-6 bg-cream-50 rounded-2xl border border-cream-200">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-forest-600 shrink-0" />
                      <span className="text-xs font-body font-medium text-ink-700 tracking-wide uppercase">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neighborhood */}
            {property.neighborhood && (
              <div className="mb-12 grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="font-display text-3xl text-ink-900 mb-3">
                    {property.neighborhood.name}: The Zenith of Abuja
                  </h2>
                  <p className="text-ink-500 font-body leading-relaxed text-sm">
                    {property.neighborhood.description}
                  </p>
                  {property.nearbyPlaces.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {property.nearbyPlaces.map((place) => (
                        <li key={place.id} className="flex items-center gap-2 text-sm text-ink-600">
                          <MapPin size={13} className="text-forest-600 shrink-0" />
                          <span>{place.distance} to {place.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Map placeholder */}
                <div className="aspect-[4/3] rounded-xl bg-cream-200 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"
                    alt={`Map of ${property.neighborhood.name}`}
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-xs font-body font-medium text-ink-800">Open in Maps</p>
                      <p className="text-2xs text-ink-500">Directions to The Studio</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - sticky sidebar */}
          <aside className="lg:sticky lg:top-24 self-start space-y-6">
            {/* Price + Specs card */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <p className="label-overline text-ink-400 mb-1">Asking Price</p>
              <p className="font-display text-3xl text-ink-900 mb-1">
                {property.currency === "NGN" ? "₦" : "$"}
              </p>
              <p className="font-display text-4xl text-ink-900 mb-6">
                {formatPriceFull(Number(property.askingPrice), property.currency).replace(/^[₦$]/, "")}
              </p>

              <div className="flex gap-6 pb-5 border-b border-cream-200 mb-5">
                <SpecBadge label="BEDS"  value={property.bedrooms} />
                <SpecBadge label="BATHS" value={property.bathrooms} />
                <SpecBadge label="SQFT"  value={property.sqft.toLocaleString()} />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={cn("badge-status", getStatusColor(property.status))}>
                  {getStatusLabel(property.status)}
                </span>
                {property.exclusive && (
                  <span className="badge-status bg-forest-800 text-cream-50">Exclusive</span>
                )}
              </div>
            </div>

            {/* Tour Request */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h3 className="font-body font-semibold text-ink-900 mb-1">Arrange a Private Tour</h3>
              <p className="text-xs text-ink-400 mb-5">
                Secure your exclusive viewing of this architectural masterpiece. Our concierge
                will contact you within 2 hours.
              </p>
              <TourRequestForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Featured Projects ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-20 bg-cream-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label-overline text-forest-600 mb-1">Recommended for Your Portfolio</p>
                <h2 className="font-display text-3xl text-ink-900">Featured Project</h2>
              </div>
              <a href="/properties" className="text-sm text-forest-700 font-body font-medium hover:text-forest-900">
                View All Listings →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SpecBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl text-ink-900">{value}</p>
      <p className="text-2xs font-body text-ink-400 tracking-widest mt-0.5">{label}</p>
    </div>
  );
}
