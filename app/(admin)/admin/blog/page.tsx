import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Clock } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { formatDateShort, cn } from "@/lib/utils";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Blog Posts</h1>
          <p className="text-sm text-ink-400 mt-1 font-body">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm">
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-cream-100 bg-cream-50/50">
              <th className="px-6 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">Post</th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden lg:table-cell">Author</th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">Status</th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden xl:table-cell">Date</th>
              <th className="px-6 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-cream-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {post.coverImage ? (
                      <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                        <Image src={post.coverImage} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                    ) : (
                      <div className="w-12 h-9 rounded-lg bg-cream-200 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-ink-900 truncate max-w-[220px]">{post.title}</p>
                      <p className="text-xs text-ink-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {post.readTime} min read
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="badge-status bg-cream-100 text-ink-600 text-2xs">
                    {post.category.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-4 text-ink-500 text-xs hidden lg:table-cell">
                  {post.author.name}
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    "badge-status text-2xs",
                    post.published
                      ? "bg-forest-50 text-forest-700"
                      : "bg-amber-50 text-amber-700"
                  )}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  {post.featured && (
                    <span className="ml-1 badge-status bg-purple-50 text-purple-700 text-2xs">Featured</span>
                  )}
                </td>
                <td className="px-4 py-4 text-ink-400 text-xs hidden xl:table-cell">
                  {formatDateShort(post.publishedAt ?? post.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-cream-100 transition-colors"
                      >
                        <Eye size={15} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-cream-100 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
