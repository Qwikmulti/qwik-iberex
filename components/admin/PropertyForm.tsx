"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { propertySchema, type PropertyFormData } from "@/lib/validations";
import { cn, slugify } from "@/lib/utils";
import { Upload, X, Loader2, CheckCircle2, ImageIcon } from "lucide-react";
import type { Neighborhood, Amenity } from "@prisma/client";

interface PropertyFormProps {
  property?: any;
  neighborhoods: Neighborhood[];
  amenities: Amenity[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS = [
  "ACTIVE", "FOR_SALE", "SELLING_FAST", "FOR_RENT",
  "HERITAGE", "NEW_CONSTRUCTION", "SOLD", "ARCHIVED",
];
const TYPE_OPTIONS = [
  "DETACH", "SEMI_DETACH", "PENTHOUSE", "ESTATE", "TERRACE", "APARTMENT", "VILLA",
];

export function PropertyForm({ property, neighborhoods, amenities, onSuccess, onCancel }: PropertyFormProps) {
  const router  = useRouter();
  const isEdit  = !!property;
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [images, setImages]       = useState<{ url: string; file?: File; id?: string }[]>(
    property?.images?.map((i: any) => ({ url: i.url, id: i.id })) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "media" | "seo">("details");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title:          property.title,
          tagline:        property.tagline ?? "",
          description:    property.description,
          narrative:      property.narrative ?? "",
          status:         property.status,
          type:           property.type,
          askingPrice:    Number(property.askingPrice),
          currency:       property.currency,
          bedrooms:       property.bedrooms,
          bathrooms:      property.bathrooms,
          sqft:           property.sqft,
          garages:        property.garages ?? 0,
          address:        property.address,
          city:           property.city,
          neighborhoodId: property.neighborhoodId ?? "",
          featured:       property.featured,
          published:      property.published,
          exclusive:      property.exclusive,
          amenityIds:     property.amenities?.map((a: any) => a.amenity.id) ?? [],
        }
      : {
          status: "FOR_SALE", type: "ESTATE", currency: "NGN",
          city: "Abuja", bedrooms: 0, bathrooms: 0, sqft: 0,
          featured: false, published: true, exclusive: false, amenityIds: [],
        },
  });

  // Image dropzone
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res  = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) setImages((prev) => [...prev, { url: data.url }]);
      } catch {}
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    setSaving(true);
    const payload = {
      ...data,
      slug: isEdit ? property.slug : slugify(data.title),
      images: images.map((img, i) => ({ url: img.url, sortOrder: i, isCover: i === 0 })),
    };

    const url    = isEdit ? `/api/admin/listings/${property.id}` : "/api/admin/listings";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else {
          router.push("/admin/listings");
          router.refresh();
        }
      }, 1000);
    }
    setSaving(false);
  };

  const TABS = [
    { id: "details", label: "Details" },
    { id: "media",   label: "Media" },
    { id: "seo",     label: "SEO" },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-cream-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-body font-medium transition-all",
              activeTab === tab.id
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Details tab ───────────────────────────────────────────────────── */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Basic info */}
          <FormCard title="Basic Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormLabel>Title *</FormLabel>
                <input {...register("title")} className={cn("input-iberex", errors.title && "border-red-400")} placeholder="e.g. The Tenssi Pavilion" />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </div>
              <div className="sm:col-span-2">
                <FormLabel>Tagline</FormLabel>
                <input {...register("tagline")} className="input-iberex" placeholder="One-line architectural hook" />
              </div>
              <div className="sm:col-span-2">
                <FormLabel>Description *</FormLabel>
                <textarea {...register("description")} rows={3} className={cn("input-iberex resize-none", errors.description && "border-red-400")} placeholder="Public-facing description" />
                {errors.description && <FieldError>{errors.description.message}</FieldError>}
              </div>
              <div className="sm:col-span-2">
                <FormLabel>Architectural Narrative</FormLabel>
                <textarea {...register("narrative")} rows={6} className="input-iberex resize-none" placeholder="Detailed editorial narrative shown on the property detail page…" />
              </div>
            </div>
          </FormCard>

          {/* Classification */}
          <FormCard title="Classification & Pricing">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <FormLabel>Status *</FormLabel>
                <select {...register("status")} className="input-iberex">
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <FormLabel>Type *</FormLabel>
                <select {...register("type")} className="input-iberex">
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <FormLabel>Neighborhood</FormLabel>
                <select {...register("neighborhoodId")} className="input-iberex">
                  <option value="">Select neighborhood</option>
                  {neighborhoods.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <FormLabel>Currency</FormLabel>
                <select {...register("currency")} className="input-iberex">
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <FormLabel>Asking Price *</FormLabel>
                <input
                  {...register("askingPrice", { valueAsNumber: true })}
                  type="number"
                  className={cn("input-iberex", errors.askingPrice && "border-red-400")}
                  placeholder="4200000000"
                />
                {errors.askingPrice && <FieldError>{errors.askingPrice.message}</FieldError>}
              </div>
            </div>
          </FormCard>

          {/* Specs */}
          <FormCard title="Specifications">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { key: "bedrooms",  label: "Bedrooms" },
                { key: "bathrooms", label: "Bathrooms" },
                { key: "sqft",      label: "Sq Ft" },
                { key: "garages",   label: "Garages" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <FormLabel>{label}</FormLabel>
                  <input
                    {...register(key as any, { valueAsNumber: true })}
                    type="number"
                    min={0}
                    className="input-iberex"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </FormCard>

          {/* Location */}
          <FormCard title="Location">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FormLabel>Address *</FormLabel>
                <input {...register("address")} className={cn("input-iberex", errors.address && "border-red-400")} placeholder="Plot 24, Maitama District" />
                {errors.address && <FieldError>{errors.address.message}</FieldError>}
              </div>
              <div>
                <FormLabel>City</FormLabel>
                <input {...register("city")} className="input-iberex" />
              </div>
            </div>
          </FormCard>

          {/* Amenities */}
          <FormCard title="Amenities">
            <Controller
              name="amenityIds"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map((amenity) => {
                    const checked = field.value.includes(amenity.id);
                    return (
                      <label
                        key={amenity.id}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm font-body",
                          checked
                            ? "border-forest-600 bg-forest-50 text-forest-800"
                            : "border-cream-200 text-ink-600 hover:border-forest-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? field.value.filter((id) => id !== amenity.id)
                              : [...field.value, amenity.id];
                            field.onChange(next);
                          }}
                          className="sr-only"
                        />
                        <span className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          checked ? "border-forest-600 bg-forest-600" : "border-cream-300"
                        )}>
                          {checked && <CheckCircle2 size={12} className="text-white" />}
                        </span>
                        {amenity.name}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </FormCard>

          {/* Flags */}
          <FormCard title="Visibility">
            <div className="flex flex-wrap gap-6">
              {[
                { key: "published", label: "Published", desc: "Visible on site" },
                { key: "featured",  label: "Featured",  desc: "Show in featured gallery" },
                { key: "exclusive", label: "Exclusive",  desc: "Mark as exclusive listing" },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer">
                  <input {...register(key as any)} type="checkbox" className="mt-0.5 rounded accent-forest-700" />
                  <div>
                    <p className="text-sm font-body font-medium text-ink-900">{label}</p>
                    <p className="text-xs text-ink-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormCard>
        </div>
      )}

      {/* ─── Media tab ─────────────────────────────────────────────────────── */}
      {activeTab === "media" && (
        <div className="space-y-6">
          <FormCard title="Property Images">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-forest-500 bg-forest-50"
                  : "border-cream-300 hover:border-forest-400 hover:bg-cream-50"
              )}
            >
              <input {...getInputProps()} />
              <Upload size={28} className="mx-auto text-ink-400 mb-3" />
              <p className="text-sm font-body font-medium text-ink-700">
                {isDragActive ? "Drop images here" : "Drag & drop images, or click to browse"}
              </p>
              <p className="text-xs text-ink-400 mt-1">JPG, PNG, WebP — up to 10MB each</p>
              {uploading && (
                <div className="flex items-center justify-center gap-2 mt-3 text-forest-600">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Uploading…</span>
                </div>
              )}
            </div>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-cream-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-1.5">
                        <span className="badge-status bg-forest-700 text-cream-50 text-2xs">Cover</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="flex items-center justify-center gap-2 py-6 text-ink-300">
                <ImageIcon size={20} />
                <span className="text-sm">No images uploaded yet</span>
              </div>
            )}
          </FormCard>
        </div>
      )}

      {/* ─── SEO tab ───────────────────────────────────────────────────────── */}
      {activeTab === "seo" && (
        <FormCard title="SEO Metadata">
          <div className="space-y-4">
            <div>
              <FormLabel>Meta Title</FormLabel>
              <input className="input-iberex" placeholder="Custom page title (defaults to property title)" />
            </div>
            <div>
              <FormLabel>Meta Description</FormLabel>
              <textarea rows={3} className="input-iberex resize-none" placeholder="160-character description for search engines" />
            </div>
          </div>
        </FormCard>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving || saved}
          className={cn(
            "btn-primary min-w-[140px] justify-center",
            saved && "bg-forest-600"
          )}
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Saved!</>
          ) : saving ? (
            <><Loader2 size={15} className="animate-spin" /> Saving…</>
          ) : (
            isEdit ? "Save Changes" : "Create Listing"
          )}
        </button>
        <button
          type="button"
          onClick={() => onCancel ? onCancel() : router.back()}
          className="btn-ghost text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-6">
      <h3 className="font-body font-semibold text-ink-900 mb-5 pb-3 border-b border-cream-100">{title}</h3>
      {children}
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block label-overline text-ink-500 mb-1.5">{children}</label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-red-500 mt-1">{children}</p>;
}
