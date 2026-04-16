"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { blogPostSchema, type BlogPostFormData } from "@/lib/validations";
import { slugify, cn } from "@/lib/utils";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Loader2, CheckCircle2, Eye, EyeOff,
} from "lucide-react";

interface BlogPostEditorProps {
  post?: any;
  authorId?: string;
}

const CATEGORIES = [
  "BUY", "SELL", "TRENDS", "BUYING_TIPS",
  "LIFESTYLE", "INTERIOR_DESIGN", "INVESTMENT", "MARKET_TRENDS",
];

export function BlogPostEditor({ post, authorId }: BlogPostEditorProps) {
  const router   = useRouter();
  const isEdit   = !!post;
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [preview, setPreview] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<BlogPostFormData>({
      resolver: zodResolver(blogPostSchema),
      defaultValues: post
        ? {
            title: post.title, excerpt: post.excerpt, category: post.category,
            readTime: post.readTime, featured: post.featured, published: post.published,
            content: post.content,
          }
        : { category: "TRENDS", readTime: 5, featured: false, published: false, content: "" },
    });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Begin your editorial piece…" }),
    ],
    content: post?.content ?? "",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[300px] font-body text-ink-800 leading-relaxed",
      },
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setSaving(true);
    const content = editor?.getHTML() ?? "";
    const payload = {
      ...data,
      content,
      slug: isEdit ? post.slug : slugify(data.title),
      authorId,
      publishedAt: data.published ? new Date().toISOString() : null,
    };

    const url    = isEdit ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => { router.push("/admin/blog"); router.refresh(); }, 1000);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Meta */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4">
        <div>
          <label className="label-overline text-ink-500 mb-1.5 block">Title *</label>
          <input
            {...register("title")}
            className={cn("input-iberex text-lg font-display", errors.title && "border-red-400")}
            placeholder="The Rise of Wellness-Focused Architecture"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label-overline text-ink-500 mb-1.5 block">Excerpt *</label>
          <textarea
            {...register("excerpt")}
            rows={2}
            className={cn("input-iberex resize-none", errors.excerpt && "border-red-400")}
            placeholder="A compelling 1-2 sentence summary shown in the listing card…"
          />
          {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt.message}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label-overline text-ink-500 mb-1.5 block">Category</label>
            <select {...register("category")} className="input-iberex">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-overline text-ink-500 mb-1.5 block">Read Time (mins)</label>
            <input {...register("readTime", { valueAsNumber: true })} type="number" min={1} className="input-iberex" />
          </div>
          <div className="flex flex-col justify-end gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input {...register("published")} type="checkbox" className="rounded accent-forest-700" />
              <span className="text-sm font-body text-ink-700">Publish immediately</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input {...register("featured")} type="checkbox" className="rounded accent-forest-700" />
              <span className="text-sm font-body text-ink-700">Feature this post</span>
            </label>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-cream-100 flex-wrap">
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold") ?? false} title="Bold">
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic") ?? false} title="Italic">
            <Italic size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-cream-200 mx-1" />
          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 }) ?? false} title="Heading 2">
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 }) ?? false} title="Heading 3">
            <Heading3 size={15} />
          </ToolbarButton>
          <div className="w-px h-5 bg-cream-200 mx-1" />
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList") ?? false} title="Bullet list">
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList") ?? false} title="Ordered list">
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote") ?? false} title="Blockquote">
            <Quote size={15} />
          </ToolbarButton>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-800 px-2 py-1 rounded-lg hover:bg-cream-100 transition-colors"
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {preview ? (
            <div
              className="prose prose-lg max-w-none font-body text-ink-800"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || saved}
          className={cn("btn-primary min-w-[140px] justify-center", saved && "bg-forest-600")}
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Saved!</>
          ) : saving ? (
            <><Loader2 size={15} className="animate-spin" /> Saving…</>
          ) : (
            isEdit ? "Save Changes" : "Create Post"
          )}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ToolbarButton({
  onClick, active, title, children,
}: { onClick: () => void; active: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded-lg transition-all",
        active
          ? "bg-forest-700 text-cream-50"
          : "text-ink-500 hover:bg-cream-100 hover:text-ink-800"
      )}
    >
      {children}
    </button>
  );
}
