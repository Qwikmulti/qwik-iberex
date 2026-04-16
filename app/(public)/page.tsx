import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getFeaturedProperties } from "@/lib/db/properties";
import { getRecentBlogPosts } from "@/lib/db/blog";
import { prisma } from "@/lib/db/prisma";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SubscribeSection } from "@/components/shared/SubscribeSection";
import type { BlogPostWithAuthor, PropertyCard as PropertyCardType } from "@/types";
import type { Neighborhood } from "@prisma/client";

export default async function HomePage() {
  const [featuredProperties, recentPosts, neighborhoods]: [PropertyCardType[], BlogPostWithAuthor[], Neighborhood[]] = await Promise.all([
    getFeaturedProperties(3),
    getRecentBlogPosts(3),
    prisma.neighborhood.findMany({
      where: { featured: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  return (
    <div className="pt-16">
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-forest-900">
        <Image
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1800"
          alt="Luxury estate in Abuja"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-900/40 to-transparent" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-20 w-full">
          {/* Eyebrow */}
          <p className="label-overline text-forest-200 mb-5 animate-fade-up">
            Exclusively Nigeria
          </p>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream-50 leading-[1.05] max-w-3xl mb-6 animate-fade-up [animation-delay:100ms]">
            Building Wealth Through Smart Real Estate Investment
          </h1>

          <p className="text-cream-300 text-base md:text-lg max-w-md mb-10 font-body animate-fade-up [animation-delay:200ms]">
            Turning Opportunities into Lasting Assets
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:300ms]">
            <Link href="/properties" className="btn-primary">
              Explore Listings <ArrowRight size={16} />
            </Link>
            <Link
              href="/properties?view=portfolio"
              className="inline-flex items-center gap-2 text-cream-200 border border-cream-400/40 px-6 py-3 rounded-lg text-sm font-body hover:bg-white/10 transition-colors"
            >
              Our Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Neighborhoods ─────────────────────────────────────────────────── */}
      <section className="py-20 max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-overline text-forest-600 mb-2">Prime Locations</p>
            <h2 className="font-display text-4xl text-ink-900">
              Abuja&apos;s Finest<br />Neighborhoods
            </h2>
          </div>
          <Link
            href="/properties"
            className="hidden md:flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 font-body font-medium transition-colors"
          >
            View All Listings <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {neighborhoods.map((hood) => (
            <Link
              key={hood.id}
              href={`/properties?neighborhood=${hood.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-200"
            >
              {hood.imageUrl && (
                <Image
                  src={hood.imageUrl}
                  alt={hood.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="label-overline text-cream-300 mb-1">{hood.tagline}</p>
                <h3 className="font-display text-2xl text-cream-50">{hood.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Properties ────────────────────────────────────────────── */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label-overline text-forest-600 mb-2">Featured Homes</p>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl text-ink-900">The Digital Gallery</h2>
                <div className="hidden md:flex items-center gap-3 ml-8">
                  <button className="px-4 py-1.5 rounded-full text-xs font-body font-medium bg-forest-700 text-cream-50">All Units</button>
                  <button className="px-4 py-1.5 rounded-full text-xs font-body font-medium bg-cream-200 text-ink-600 hover:bg-cream-300 transition-colors">Residential</button>
                </div>
              </div>
            </div>
            <Link href="/properties" className="hidden md:flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 font-body font-medium transition-colors">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProperties.map((property, i) => (
              <PropertyCard key={property.id} property={property} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Curating Space ────────────────────────────────────────────────── */}
      <section className="bg-forest-900 text-cream-50">
        <div className="max-w-[1200px] mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900"
              alt="Curating Space"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="label-overline text-forest-300 mb-4">Beyond Boundaries</p>
            <h2 className="font-display text-4xl md:text-5xl text-cream-50 mb-6 leading-tight">
              The Art of Curating Space.
            </h2>
            <p className="text-cream-300 font-body leading-relaxed mb-10">
              We believe that a home is more than a residence—it is a physical manifestation
              of your journey. Our curators hand-select properties that push the boundaries
              of architecture and sustainable luxury.
            </p>
            <div className="flex gap-10 mb-10">
              <div>
                <p className="font-display text-4xl text-cream-50">140+</p>
                <p className="label-overline text-forest-300 mt-1">Award Winning Designs</p>
              </div>
              <div>
                <p className="font-display text-4xl text-cream-50">£2.4B</p>
                <p className="label-overline text-forest-300 mt-1">Managed Assets</p>
              </div>
            </div>
            <Link href="/contact" className="btn-secondary border-cream-400/40 text-cream-100 hover:bg-white/10">
              Inquire More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Experience Abuja ───────────────────────────────────────────────── */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display text-4xl md:text-5xl text-ink-900 mb-6">
            Experience Abuja
          </h2>
          <p className="text-ink-600 font-body leading-relaxed mb-10">
            Beyond real estate, we offer a gateway to the lifestyle, power, and prestige of
            Nigeria&apos;s capital city. Abuja isn&apos;t just a location—it&apos;s an
            investment in the future.
          </p>
          <div className="flex gap-10">
            <div>
              <p className="font-display text-4xl text-forest-700">12%</p>
              <p className="label-overline text-ink-400 mt-1">Avg. Annual Appreciation</p>
            </div>
            <div>
              <p className="font-display text-4xl text-forest-700">24/7</p>
              <p className="label-overline text-ink-400 mt-1">Concierge Management</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink-900">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900"
            alt="Abuja skyline"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-cream-200 text-xs font-body italic">
              &ldquo;The New Standard of West African Luxury&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ─── Recent Journal Entries ─────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-ink-950 text-cream-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12">
              <p className="label-overline text-ink-400 mb-3">Editorial</p>
              <h2 className="font-display text-4xl text-cream-50">Recent Journal Entries</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-ink-800 hover:bg-ink-700 transition-colors"
                >
                  {post.coverImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="label-overline text-forest-300">
                        {post.category.replace("_", " ")}
                      </span>
                      <span className="text-ink-500 text-2xs">·</span>
                      <span className="flex items-center gap-1 text-2xs text-ink-500">
                        <Clock size={10} /> {post.readTime} MIN READ
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-cream-100 group-hover:text-cream-50 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-ink-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Subscribe ──────────────────────────────────────────────────────── */}
      <SubscribeSection />
    </div>
  );
}
