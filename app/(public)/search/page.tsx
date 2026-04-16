import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SearchInput } from "@/components/shared/SearchInput";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Iberex Estate listings and editorial content.",
};

interface SearchParams {
  q?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const [properties, posts] = query
    ? await Promise.all([
        prisma.property.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
              {
                neighborhood: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            ],
          },
          include: { neighborhood: { select: { name: true, slug: true } } },
          take: 12,
        }),
        prisma.blogPost.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 6,
        }),
      ])
    : [[], []];

  const totalResults = properties.length + posts.length;

  return (
    <div className="pt-16 min-h-screen bg-cream-100">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-5xl text-ink-900 mb-6">Search</h1>
          <SearchInput defaultValue={query} />
        </div>

        {/* Results summary */}
        {query && (
          <p className="text-sm text-ink-400 font-body mb-8">
            {totalResults > 0 ? (
              <>
                <span className="text-ink-900 font-medium">{totalResults}</span>{" "}
                results for &ldquo;{query}&rdquo;
              </>
            ) : (
              <>
                No results for &ldquo;{query}&rdquo; — try a different search.
              </>
            )}
          </p>
        )}

        {!query && (
          <div className="text-center py-24 text-ink-300">
            <Search size={48} className="mx-auto mb-4 opacity-40" />
            <p className="font-display text-2xl text-ink-400 mb-2">
              Start searching
            </p>
            <p className="text-sm">
              Try &ldquo;Maitama&rdquo;, &ldquo;penthouse&rdquo;, or
              &ldquo;sustainable&rdquo;
            </p>
          </div>
        )}

        {/* Property results */}
        {properties.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display text-2xl text-ink-900 mb-6">
              Properties
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p as any} />
              ))}
            </div>
          </div>
        )}

        {/* Blog results */}
        {posts.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-ink-900 mb-6">Journal</h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex items-start gap-5 bg-white rounded-2xl border border-cream-200 p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="label-overline text-forest-600 mb-1">
                      {post.category.replace("_", " ")}
                    </p>
                    <h3 className="font-display text-xl text-ink-900 mb-1 group-hover:text-forest-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-ink-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  {post.coverImage && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-cream-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
