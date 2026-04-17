import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/db/properties";
import { PropertyCard } from "@/components/property/PropertyCard";
import { TourRequestForm } from "@/components/property/TourRequestForm";
import { AmenityIcon } from "@/components/property/AmenityIcon";
import { formatPriceFull, cn } from "@/lib/utils";
import Link from "next/link";

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
    <div className="bg-white min-h-screen">
      {/* ─── Gallery Section ─────────────────────────────────────────────── */}
      <section className="pt-20 lg:pt-24 px-1 lg:px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-1 lg:gap-2">
          {/* Main Hero Image */}
          <div className="md:col-span-8 relative aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-cream-100 group">
            {coverImage?.url || property.coverImageUrl ? (
              <>
                <Image
                  src={coverImage?.url ?? property.coverImageUrl!}
                  alt={coverImage?.altText ?? property.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
                  <span className="bg-[#0a0a0a]/40 backdrop-blur-md text-cream-50 text-[10px] sm:text-xs font-body px-5 py-2.5 rounded-sm tracking-[0.2em] uppercase font-medium">
                    MAIN PAVILION
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-cream-200" />
            )}
          </div>

          {/* Side Images Column */}
          <div className="md:col-span-4 flex flex-col gap-1 lg:gap-2">
            {sideImages.map((img, i) => (
              <div key={img.id} className="relative flex-1 aspect-[16/9] md:aspect-auto overflow-hidden bg-cream-200 group">
                <Image
                  src={img.url}
                  alt={img.altText ?? `${property.title} ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
            {/* Fallback pattern if fewer images */}
            {sideImages.length < 2 && (
               <div className="relative flex-1 aspect-[16/9] md:aspect-auto bg-cream-100 flex items-center justify-center">
                  <p className="text-[10px] tracking-widest text-ink-300 uppercase">Gallery Pending</p>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-forest-700">EXCLUSIVE LISTING</span>
                 <span className="w-1 h-1 rounded-full bg-forest-200 animate-pulse" />
                 <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink-400">
                    {property.neighborhood?.name ?? property.city}, ABUJA
                 </span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-ink-900 leading-[0.9] tracking-tight">
                {property.title}
              </h1>
              
              <p className="text-xl md:text-2xl font-body text-ink-500 leading-relaxed max-w-2xl font-light">
                {property.tagline}
              </p>
            </div>

            {/* Architectural Narrative */}
            <div className="space-y-8">
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-ink-400 border-b border-cream-200 pb-4">Architectural Narrative</h2>
              <div className="space-y-6 text-lg font-body text-ink-800 leading-[1.8] max-w-3xl">
                {property.narrative ? (
                  property.narrative.split("\n\n").map((para, i) => (
                    <p key={i} className="first-letter:text-4xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-forest-800">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="italic text-ink-400">Drafting the architectural story of this masterpiece…</p>
                )}
              </div>
            </div>

            {/* Signature Amenities */}
            <div className="space-y-10">
               <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-ink-400 border-b border-cream-200 pb-4">Signature Amenities</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                  {amenities.slice(0, 8).map((amenity) => (
                    <div key={amenity.id} className="space-y-4 group">
                      <div className="w-10 h-10 rounded-full border border-forest-100 flex items-center justify-center text-forest-800 transition-all duration-300 group-hover:bg-forest-800 group-hover:text-cream-50 group-hover:scale-110">
                        <AmenityIcon name={amenity.name} size={18} />
                      </div>
                      <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-ink-900">
                        {amenity.name}
                      </p>
                    </div>
                  ))}
                  {amenities.length === 0 && (
                     <div className="col-span-full py-10 bg-cream-50 rounded-xl text-center text-ink-400 text-sm font-body tracking-wider">
                        Amenities collection currently in curation.
                     </div>
                  )}
               </div>
            </div>

            {/* Neighborhood Spotlight */}
            {property.neighborhood && (
              <div className="pt-20 border-t border-cream-200 space-y-12">
                <div className="grid md:grid-cols-2 gap-16 items-center text-ink-900">
                  <div className="space-y-8">
                    <h2 className="font-display text-4xl lg:text-5xl leading-tight">
                      {property.neighborhood.name}:<br />
                      <span className="text-forest-700 italic">The Zenith of Abuja</span>
                    </h2>
                    <p className="text-ink-600 font-body leading-[1.8] text-lg">
                      {property.neighborhood.description}
                    </p>
                    
                    {property.nearbyPlaces.length > 0 && (
                      <div className="space-y-4 pt-4">
                        {property.nearbyPlaces.map((place) => (
                          <div key={place.id} className="flex items-center gap-4 text-sm font-body text-ink-800">
                            <div className="w-6 h-6 rounded-full bg-forest-50 flex items-center justify-center">
                               <MapPin size={12} className="text-forest-800" />
                            </div>
                            <span className="font-bold tracking-tight">{place.distance} TO {place.name.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Map / Image Overlay */}
                  <div className="relative aspect-square rounded-[40px] overflow-hidden bg-forest-900 shadow-2xl shadow-forest-900/10 group">
                    <Image
                      src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&fit=crop"
                      alt={property.neighborhood.name}
                      fill
                      className="object-cover opacity-60 transition-transform duration-2000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                       <div className="w-16 h-16 rounded-full bg-forest-800 flex items-center justify-center text-cream-50 animate-pulse">
                          <MapPin size={24} />
                       </div>
                    </div>
                    <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-md rounded-2xl">
                       <p className="text-xs font-bold text-ink-900 tracking-wider">ESTATE PROXY MAP</p>
                       <p className="text-[10px] text-forest-700 font-medium tracking-widest mt-1">DIRECT ACCESS ENABLED</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-10 group">
            
            {/* Price & Specs Card */}
            <div className="bg-[#fcfbf9] border border-cream-200 rounded-[32px] p-10 lg:p-12 space-y-12 transition-all duration-500 hover:shadow-2xl hover:shadow-forest-900/5">
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-ink-300">Asking Price</p>
                <div className="flex items-baseline gap-2">
                   <span className="font-display text-4xl lg:text-5xl text-forest-800 leading-none">
                      {property.currency === "NGN" ? "₦" : "$"}
                   </span>
                   <span className="font-display text-5xl lg:text-7xl text-ink-900 leading-none tracking-tight">
                      {formatPriceFull(Number(property.askingPrice), property.currency).replace(/^[₦$]/, "").split(".")[0]}
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 py-10 border-y border-cream-100">
                <div className="space-y-1 text-center">
                  <p className="font-display text-3xl text-ink-900">{String(property.bedrooms).padStart(2, '0')}</p>
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-ink-400">Beds</p>
                </div>
                <div className="space-y-1 text-center border-x border-cream-100">
                  <p className="font-display text-3xl text-ink-900">{String(property.bathrooms).padStart(2, '0')}</p>
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-ink-400">Baths</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="font-display text-3xl text-ink-900 truncate">{(property.sqft / 1000).toFixed(1)}K</p>
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-ink-400">Sq Ft</p>
                </div>
              </div>

              {/* Status & Exclusive */}
              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-2 pr-4 border-r border-cream-200">
                    <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest text-ink-900 uppercase">AVAILABLE NOW</span>
                 </div>
                 {property.exclusive && (
                   <div className="bg-forest-100/50 px-3 py-1 rounded-sm">
                      <span className="text-[9px] font-bold tracking-widest text-forest-800 uppercase italic">EXCLUSIVE</span>
                   </div>
                 )}
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-white border border-cream-200 rounded-[32px] p-10 lg:p-12 space-y-8">
              <div className="space-y-2">
                 <h3 className="font-display text-3xl text-ink-900 tracking-tight">Arrange a Private Tour</h3>
                 <p className="text-sm font-body text-ink-400 leading-relaxed font-light">
                   Secure your exclusive viewing of this architectural masterpiece. Our concierge will contact you within 2 hours.
                 </p>
              </div>
              <TourRequestForm propertyId={property.id} propertyTitle={property.title} />
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Featured Section ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-24 lg:py-40 bg-cream-50 border-t border-cream-200">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16 lg:mb-24">
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-forest-700">RECOMMENDED FOR YOUR PORTFOLIO</p>
                <h2 className="font-display text-5xl lg:text-7xl text-ink-900 leading-tight">Featured Project</h2>
              </div>
              <Link 
                href="/properties" 
                className="group flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-ink-900 transition-colors hover:text-forest-800"
              >
                VIEW ALL LISTINGS
                <div className="w-10 h-10 rounded-full border border-ink-100 flex items-center justify-center transition-transform group-hover:translate-x-2">
                   <ArrowRight size={16} />
                </div>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {related.map((p) => (
                <div key={p.id} className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                   <PropertyCard property={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
