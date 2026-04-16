import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft, CalendarDays } from "lucide-react";
import { getBlogPostBySlug, getRecentBlogPosts } from "@/lib/db/blog";
import { SubscribeSection } from "@/components/shared/SubscribeSection";
import { formatDate, cn } from "@/lib/utils";
import type { BlogPostWithAuthor } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  BUY:          "Buy",
  SELL:         "Sell",
  TRENDS:       "Trends",
  BUYING_TIPS:  "Buying Tips",
  LIFESTYLE:    "Lifestyle",
};

function categoryLabel(cat: string) {
  return CATEGORY_LABEL[cat] ?? cat.replace(/_/g, " ");
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRecentBlogPosts(3),
  ]);

  if (!post) notFound();

  const related = recentPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="pt-16 min-h-screen bg-cream-100">
      {/* ─── Hero / Cover ────────────────────────────────────────────────── */}
      {post.coverImage && (
        <div className="relative h-[55vh] min-h-[380px] max-h-[560px] bg-ink-900 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-900/30 to-transparent" />

          {/* Back link floating over hero */}
          <div className="absolute top-8 left-0 right-0 max-w-[800px] mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-cream-300 hover:text-cream-50 text-sm font-body transition-colors"
            >
              <ArrowLeft size={15} /> Back to Journal
            </Link>
          </div>

          {/* Category + title overlay */}
          <div className="absolute bottom-0 left-0 right-0 max-w-[800px] mx-auto px-6 pb-10">
            <p className="label-overline text-forest-300 mb-3">
              {categoryLabel(post.category)}
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-cream-50 leading-tight max-w-2xl">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      {/* ─── Article body ────────────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-6 py-12">

        {/* No cover image: back link + heading in-column */}
        {!post.coverImage && (
          <>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-ink-400 hover:text-ink-700 text-sm font-body mb-8 transition-colors"
            >
              <ArrowLeft size={15} /> Back to Journal
            </Link>
            <p className="label-overline text-forest-600 mb-3">
              {categoryLabel(post.category)}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-ink-900 mb-6 leading-tight">
              {post.title}
            </h1>
          </>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 py-6 border-y border-cream-200 mb-10">
          {/* Author avatar + name */}
          <div className="flex items-center gap-3">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name ?? "Author"}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center shrink-0">
                <span className="text-cream-50 text-xs font-body font-semibold">
                  {post.author.name?.charAt(0).toUpperCase() ?? "A"}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-body font-medium text-ink-800">
                {post.author.name}
              </p>
              <p className="text-2xs text-ink-400 uppercase tracking-wide">Contributor</p>
            </div>
          </div>

          <span className="text-cream-300 hidden sm:block">·</span>

          <div className="flex items-center gap-1 text-ink-400 text-sm">
            <CalendarDays size={14} />
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          </div>

          <span className="text-cream-300 hidden sm:block">·</span>

          <div className="flex items-center gap-1 text-ink-400 text-sm">
            <Clock size={14} />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Excerpt lead */}
        {post.excerpt && (
          <p className="text-ink-600 font-body text-lg leading-relaxed mb-8 border-l-4 border-forest-600 pl-5 italic">
            {post.excerpt}
          </p>
        )}

        {/* Main content */}
        <div
          className={cn(
            "font-body text-ink-700 leading-[1.85] text-base",
            "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink-900 [&_h2]:mt-10 [&_h2]:mb-4",
            "[&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink-900 [&_h3]:mt-8 [&_h3]:mb-3",
            "[&_p]:mb-5",
            "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-2",
            "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol>li]:mb-2",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-forest-600 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-ink-500 [&_blockquote]:my-8",
            "[&_strong]:font-semibold [&_strong]:text-ink-900",
            "[&_a]:text-forest-700 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-forest-900",
            "[&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full [&_img]:object-cover"
          )}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags / category pill */}
        <div className="mt-12 pt-8 border-t border-cream-200">
          <Link
            href={`/blog?category=${post.category}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-50 text-forest-700 text-sm font-body font-medium hover:bg-forest-100 transition-colors border border-forest-200"
          >
            {categoryLabel(post.category)}
          </Link>
        </div>
      </div>

      {/* ─── Related posts ────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 bg-cream-50 border-t border-cream-200">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label-overline text-forest-600 mb-1">Continue Reading</p>
                <h2 className="font-display text-3xl text-ink-900">More from the Journal</h2>
              </div>
              <Link
                href="/blog"
                className="hidden md:flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 font-body font-medium transition-colors"
              >
                All Articles →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {related.map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Subscribe ────────────────────────────────────────────────────── */}
      <SubscribeSection />
    </div>
  );
}

function RelatedCard({ post }: { post: BlogPostWithAuthor }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-5 bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-md transition-shadow p-0"
    >
      {post.coverImage && (
        <div className="relative w-32 shrink-0 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="128px"
          />
        </div>
      )}
      <div className="flex-1 py-5 pr-5">
        <p className="label-overline text-forest-600 mb-1.5">
          {categoryLabel(post.category)}
        </p>
        <h3 className="font-display text-base text-ink-900 line-clamp-2 mb-2 group-hover:text-forest-700 transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-2xs text-ink-400">
          <Clock size={10} />
          <span>{post.readTime} MIN READ</span>
        </div>
      </div>
    </Link>
  );
}
