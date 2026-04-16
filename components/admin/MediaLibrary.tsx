"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, Copy, Trash2, Loader2, Check, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@prisma/client";

interface MediaLibraryProps {
  assets: MediaAsset[];
}

export function MediaLibrary({ assets: initialAssets }: MediaLibraryProps) {
  const router = useRouter();
  const [assets, setAssets]       = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied]       = useState<string | null>(null);
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [search, setSearch]       = useState("");

  const onDrop = useCallback(async (files: File[]) => {
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res  = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          setAssets((prev) => [
            {
              id: data.id ?? String(Date.now()),
              filename: file.name,
              url: data.url,
              mimeType: file.type,
              size: file.size,
              width: null,
              height: null,
              altText: null,
              tags: [],
              uploadedBy: null,
              bucket: "property-images",
              path: data.path,
              createdAt: new Date(),
            } as MediaAsset,
            ...prev,
          ]);
        }
      } catch {}
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
  });

  const copyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    return `${(bytes / 1_000).toFixed(0)} KB`;
  };

  const filtered = assets.filter((a) =>
    a.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-forest-500 bg-forest-50"
            : "border-cream-300 hover:border-forest-400 hover:bg-cream-50"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-forest-600">
            <Loader2 size={24} className="animate-spin" />
            <span className="font-body font-medium">Uploading…</span>
          </div>
        ) : (
          <>
            <Upload size={28} className="mx-auto text-ink-400 mb-3" />
            <p className="font-body font-medium text-ink-700 mb-1">
              {isDragActive ? "Drop to upload" : "Drag & drop images here"}
            </p>
            <p className="text-xs text-ink-400">or click to browse · JPG, PNG, WebP</p>
          </>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets…"
          className="input-iberex max-w-xs"
        />
        <p className="text-sm text-ink-400">{filtered.length} assets</p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200 py-20 text-center">
          <ImageIcon size={36} className="text-ink-300 mx-auto mb-3" />
          <p className="text-ink-400">No media assets yet. Upload some images above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className={cn(
                "group relative bg-cream-200 rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all",
                selected.has(asset.id) ? "border-forest-600" : "border-transparent hover:border-forest-300"
              )}
              onClick={() =>
                setSelected((prev) => {
                  const next = new Set(prev);
                  next.has(asset.id) ? next.delete(asset.id) : next.add(asset.id);
                  return next;
                })
              }
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.altText ?? asset.filename}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  <p className="text-2xs text-cream-100 truncate mb-1 leading-tight">{asset.filename}</p>
                  <p className="text-2xs text-cream-300">{formatSize(asset.size)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); copyUrl(asset.url, asset.id); }}
                  className="w-7 h-7 bg-black/60 text-white rounded-lg flex items-center justify-center hover:bg-black/80 transition-colors"
                  title="Copy URL"
                >
                  {copied === asset.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>

              {/* Selected check */}
              {selected.has(asset.id) && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-forest-700 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
