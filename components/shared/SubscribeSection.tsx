"use client";
// src/components/shared/SubscribeSection.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeSchema, type SubscribeFormData } from "@/lib/validations";

export function SubscribeSection() {
  const [subscribed, setSubscribed] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<SubscribeFormData>({ resolver: zodResolver(subscribeSchema) });

  const onSubmit = async (data: SubscribeFormData) => {
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubscribed(true);
  };

  return (
    <section className="py-20 bg-cream-50">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <h2 className="font-display text-3xl text-ink-900 mb-3">
          Stay informed on new developments.
        </h2>
        <p className="text-ink-500 font-body mb-8 text-sm leading-relaxed">
          Join our private registry to receive early access to off-market listings
          and architectural insights.
        </p>

        {subscribed ? (
          <p className="text-forest-700 font-body font-medium">
            ✓ You&apos;re on the list. We&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 max-w-md mx-auto">
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="input-iberex flex-1"
            />
            <button type="submit" disabled={isSubmitting} className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
