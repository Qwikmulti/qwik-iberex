"use client";
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
    // Artificial delay to feel premium
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "tour-request" }),
    });
    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-forest-600" />
        </div>
        <p className="font-display text-xl text-ink-900 mb-2">Request Received</p>
        <p className="text-sm text-ink-500 max-w-[200px] mx-auto leading-relaxed">
          Our concierge will contact you within 2 hours to finalize your viewing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("propertyId")} type="hidden" />
        <input {...register("propertyTitle")} type="hidden" />

        <div className="space-y-3">
          <div>
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className={cn(
                "w-full px-4 py-3.5 bg-cream-100 border-none rounded-sm text-sm font-body text-ink-800 placeholder:text-ink-400 focus:ring-1 focus:ring-forest-800 transition-all",
                errors.fullName && "bg-red-50"
              )}
            />
            {errors.fullName && <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">{errors.fullName.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email Address"
              type="email"
              className={cn(
                "w-full px-4 py-3.5 bg-cream-100 border-none rounded-sm text-sm font-body text-ink-800 placeholder:text-ink-400 focus:ring-1 focus:ring-forest-800 transition-all",
                errors.email && "bg-red-50"
              )}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">{errors.email.message}</p>}
          </div>

          <div>
            <textarea
              {...register("specialRequirements")}
              placeholder="Special Requirements"
              rows={3}
              className="w-full px-4 py-3.5 bg-cream-100 border-none rounded-sm text-sm font-body text-ink-800 placeholder:text-ink-400 focus:ring-1 focus:ring-forest-800 transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-forest-900 hover:bg-[#0a231b] text-cream-100 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              <span>PROCESSING…</span>
            </div>
          ) : (
            "REQUEST DOSSIER"
          )}
        </button>
      </form>

      {/* Principal Consultant Bio */}
      <div className="flex items-center gap-4 pt-6 border-t border-cream-100">
        <div className="relative w-12 h-12 rounded-lg bg-forest-900 overflow-hidden shrink-0 shadow-lg shadow-forest-900/10">
          <div className="absolute inset-0 flex items-center justify-center text-cream-100 font-display text-lg">
            AO
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" 
            alt="Amara Okafor" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
          />
        </div>
        <div>
          <p className="text-[13px] font-body font-semibold text-ink-900 leading-none mb-1">AMARA OKAFOR</p>
          <p className="text-[10px] text-ink-400 font-body tracking-[0.1em] uppercase">Principal Consultant</p>
        </div>
      </div>
    </div>
  );
}
