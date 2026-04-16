"use client";
// src/components/property/TourRequestForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tourRequestSchema, type TourRequestFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";

interface TourRequestFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function TourRequestForm({ propertyId, propertyTitle }: TourRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TourRequestFormData>({
    resolver: zodResolver(tourRequestSchema),
    defaultValues: { propertyId, propertyTitle },
  });

  const onSubmit = async (data: TourRequestFormData) => {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "tour-request" }),
    });
    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 size={36} className="text-forest-600 mx-auto mb-3" />
        <p className="font-body font-medium text-ink-900 mb-1">Tour Requested!</p>
        <p className="text-sm text-ink-500">Our concierge will contact you within 2 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register("propertyId")} type="hidden" />
      <input {...register("propertyTitle")} type="hidden" />

      <div>
        <input
          {...register("fullName")}
          placeholder="Full Name"
          className={cn("input-iberex", errors.fullName && "border-red-400")}
        />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <input
          {...register("email")}
          placeholder="Email Address"
          type="email"
          className={cn("input-iberex", errors.email && "border-red-400")}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          {...register("specialRequirements")}
          placeholder="Special Requirements"
          rows={3}
          className="input-iberex resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary justify-center"
      >
        {isSubmitting ? (
          <><Loader2 size={15} className="animate-spin" /> Submitting…</>
        ) : (
          "REQUEST DOSSIER"
        )}
      </button>

      {/* Agent */}
      <div className="flex items-center gap-3 pt-2 border-t border-cream-100">
        <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-cream-50 text-xs font-bold">
          AO
        </div>
        <div>
          <p className="text-xs font-body font-medium text-ink-800">Amana Okafor</p>
          <p className="text-2xs text-ink-400 tracking-wide uppercase">Principal Consultant</p>
        </div>
      </div>
    </form>
  );
}
