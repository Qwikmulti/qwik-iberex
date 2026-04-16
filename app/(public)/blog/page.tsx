// src/app/(public)/blog/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getBlogPosts, getFeaturedBlogPost } from "@/lib/db/blog";
import { SubscribeSection } from "@/components/shared/SubscribeSection";
import { formatDate, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description: "Perspective & Curated Living — exploring the intersection of architectural innovation, high-end market dynamics, and the art of intentional living.",
};

const CATEGORIES = [
  { label: "Buy",          value: "BUY" },
  { label: "Sell",         value: "SELL" },
  { label: "Trends",       value: "TRENDS" },
  { label: "Buying Tips",  value: "BUYING_TIPS" },
  { label: "Lifestyle",    value: "LIFESTYLE" },
];

interface SearchParams { category?: string; page?: string; }

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params   = await searchParams;
  const category = params.category?.toUpperCase();
  const page     = parseInt(params.page ?? "1");

  const [featured, { data: posts }] = await Promise.all([
    getFeaturedBlogPost(),
    getBlogPosts(category, page, 9),
  ]);

  const categoryLabel = (cat: string) => cat.replace("_", " ");

  return (
    <div className="pt-16 min-h-screen bg-cream-100">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="label-overline text-forest-600 mb-2">Iberex Journal Blog</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-4">
            Perspective &amp;<br />Curated Living.
          </h1>
          <p className="text-ink-500 font-body max-w-md">
            Exploring the intersection of architectural innovation, high-end market dynamics,
            and the art of intentional living.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-cream-200 pb-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === category ? "/blog" : `/blog?category=${cat.value}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors",
                (cat.value === category || (!category && cat.value === "BUY" && !params.category))
                  ? "bg-forest-700 text-cream-50"
                  : "bg-cream-200 text-ink-600 hover:bg-cream-300"
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Featured post + sidebar */}
        {featured && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 mb-14">
            <Link href={`/blog/${featured.slug}`} className="group block rounded-2xl overflow-hidden bg-ink-900 relative aspect-[16/9] lg:aspect-auto">
              {featured.coverImage && (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover opacity-70 transition-opacity group-hover:opacity-80"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <p className="label-overline text-forest-300 mb-2">
                  {categoryLabel(featured.category)}
                </p>
                <h2 className="font-display text-3xl text-cream-50 mb-3 max-w-md group-hover:text-cream-100 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-cream-300 text-sm line-clamp-2 max-w-md">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <p className="text-xs font-body font-medium text-cream-200">
                    {featured.author.name?.toUpperCase()}
                  </p>
                  <span className="text-ink-400 text-xs">·</span>
                  <p className="text-xs text-ink-400">Architecture Critic · {featured.readTime} min read</p>
                </div>
              </div>
            </Link>

            {/* Side articles */}
            <div className="flex flex-col gap-4">
              {posts.slice(0, 2).filter(p => p.id !== featured.id).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-cream-200 p-0 hover:shadow-md transition-shadow"
                >
                  {post.coverImage && (
                    <div className="relative w-28 shrink-0 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <p className="label-overline text-forest-600 mb-1">{categoryLabel(post.category)}</p>
                    <h3 className="font-display text-base text-ink-900 line-clamp-2 mb-1 group-hover:text-forest-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-ink-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-md transition-shadow"
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
                  <span className="label-overline text-forest-600">{categoryLabel(post.category)}</span>
                  <span className="flex items-center gap-1 text-2xs text-ink-400">
                    <Clock size={10} /> {post.readTime} MIN READ
                  </span>
                </div>
                <h3 className="font-display text-lg text-ink-900 line-clamp-2 mb-2 group-hover:text-forest-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-ink-400 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl bg-forest-900 text-cream-50 p-10 md:p-14">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl mb-3">The Weekly Newsletter.</h2>
            <p className="text-cream-300 font-body mb-8 text-sm leading-relaxed">
              Join 12,000+ industry leaders and investors. Curated market reports and exclusive
              property previews delivered to your inbox every Sunday.
            </p>
            <form
              action="/api/subscribe"
              method="POST"
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-cream-100 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-cream-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-cream-50 text-ink-900 font-body font-medium text-sm rounded-lg hover:bg-cream-100 transition-colors whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
