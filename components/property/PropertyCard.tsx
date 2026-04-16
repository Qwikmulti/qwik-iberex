import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { cn, formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import type { PropertyCard as PropertyCardType } from "@/types";

interface PropertyCardProps {
  property: PropertyCardType;
  className?: string;
  priority?: boolean;
}

export function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const {
    title, slug, status, askingPrice, currency,
    bedrooms, bathrooms, sqft, address,
    neighborhood, coverImageUrl, exclusive,
  } = property;

  return (
    <Link
      href={`/properties/${slug}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden card-hover",
        "border border-cream-200/80",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
            <span className="text-ink-300 text-sm">No image</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={cn("badge-status", getStatusColor(status))}>
            {getStatusLabel(status)}
          </span>
        </div>

        {/* Exclusive badge */}
        {exclusive && (
          <div className="absolute top-3 right-3">
            <span className="badge-status bg-forest-800 text-cream-50">
              Exclusive
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        {neighborhood && (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={11} className="text-ink-400 shrink-0" />
            <span className="text-2xs font-body text-ink-500 tracking-wide uppercase">
              {neighborhood.name}, Abuja
            </span>
          </div>
        )}

        {/* Title + Price */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display text-lg leading-snug text-ink-900 group-hover:text-forest-700 transition-colors line-clamp-2">
            {title}
          </h3>
          <span className="text-forest-700 font-body font-medium text-sm whitespace-nowrap mt-0.5">
            {formatPrice(Number(askingPrice), currency)}
          </span>
        </div>

        {/* Address */}
        <p className="text-xs text-ink-400 mb-4 line-clamp-1">{address}</p>

        {/* Specs */}
        <div className="flex items-center gap-4 pt-3 border-t border-cream-200">
          <SpecItem icon={<Bed size={13} />} value={`${bedrooms} BEDS`} />
          <SpecItem icon={<Bath size={13} />} value={`${bathrooms} BATHS`} />
          <SpecItem icon={<Maximize2 size={13} />} value={`${sqft.toLocaleString()} SQ FT`} />
        </div>
      </div>
    </Link>
  );
}

function SpecItem({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-ink-500">
      {icon}
      <span className="text-2xs font-body font-medium tracking-wider">{value}</span>
    </div>
  );
}
