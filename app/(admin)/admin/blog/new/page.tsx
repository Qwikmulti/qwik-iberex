import { auth } from "@/lib/auth/auth";
import { BlogPostEditor } from "@/components/admin/BlogPostEditor";

export default async function NewBlogPostPage() {
  const session = await auth();
  return (
    <div className="max-w-[900px] space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-900">New Blog Post</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">
          Craft an editorial piece for the Iberex Journal.
        </p>
      </div>
      <BlogPostEditor authorId={(session?.user as any)?.id} />
    </div>
  );
}
