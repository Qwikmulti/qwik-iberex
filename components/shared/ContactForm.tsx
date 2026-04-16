"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<InquiryFormData>({ resolver: zodResolver(inquirySchema) });

  const onSubmit = async (data: InquiryFormData) => {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: "contact-form" }),
    });
    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 size={48} className="text-forest-600 mx-auto mb-4" />
        <h3 className="font-display text-2xl text-ink-900 mb-2">Message Sent</h3>
        <p className="text-ink-500">Our team will respond within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-overline text-ink-500 mb-2 block">Full Name</label>
          <input
            {...register("fullName")}
            placeholder="e.g. Julian Vane"
            className={cn("input-iberex", errors.fullName && "border-red-400")}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="label-overline text-ink-500 mb-2 block">Email Address</label>
          <input
            {...register("email")}
            placeholder="julian@vane.com"
            type="email"
            className={cn("input-iberex", errors.email && "border-red-400")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-overline text-ink-500 mb-2 block">Phone Number</label>
          <input
            {...register("phone")}
            placeholder="+234 07033333331"
            className="input-iberex"
          />
        </div>
        <div>
          <label className="label-overline text-ink-500 mb-2 block">Property of Interest</label>
          <input
            placeholder="Select a property"
            className="input-iberex"
          />
        </div>
      </div>

      <div>
        <label className="label-overline text-ink-500 mb-2 block">Your Message</label>
        <textarea
          {...register("message")}
          placeholder="Tell us about your requirements…"
          rows={5}
          className={cn("input-iberex resize-none", errors.message && "border-red-400")}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? (
          <><Loader2 size={15} className="animate-spin" /> Sending…</>
        ) : (
          <>SEND INQUIRY <ArrowRight size={15} /></>
        )}
      </button>
    </form>
  );
}
