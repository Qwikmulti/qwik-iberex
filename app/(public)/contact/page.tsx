import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with Iberex Estate & Development. Our dedicated advisors are here to curate your next residential journey.",
};

export default function ContactPage() {
  return (
    <div className="pt-16 min-h-screen bg-cream-100">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-14">
          <p className="label-overline text-forest-600 mb-3">Connect With Excellence</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-5">
            How can we help?
          </h1>
          <p className="text-ink-500 font-body max-w-lg text-lg leading-relaxed">
            Whether you&apos;re seeking a private viewing or architectural consultation, our
            dedicated advisors are here to curate your next residential journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Form card */}
          <div className="bg-white rounded-2xl border border-cream-200 p-8">
            <ContactForm />
          </div>

          {/* Studio info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-cream-200 p-8">
              <h2 className="font-display text-2xl text-ink-900 mb-6">The Studio</h2>
              <div className="space-y-5">
                <ContactDetail
                  icon={<MapPin size={18} className="text-forest-600" />}
                  label="Global Headquarters"
                  value="976, Olusegun Obasanjo Way, Wuye, Abuja, FCT, Nigeria."
                />
                <ContactDetail
                  icon={<Phone size={18} className="text-forest-600" />}
                  label="Tel"
                  value="08030600177"
                />
                <ContactDetail
                  icon={<Mail size={18} className="text-forest-600" />}
                  label="E-Mail"
                  value="iberexestatesinvestment@gmail.com"
                  isLink
                />
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
              <div className="relative aspect-[4/3] bg-cream-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d7.4983!3d9.0765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDQnMzUuNCJOIDfCsDI5JzUzLjkiRQ!5e0!3m2!1sen!2sng!4v1"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: "grayscale(0.3)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-body font-medium text-ink-800">Open in Maps</p>
                <p className="text-xs text-ink-400">Directions to The Studio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactDetail({
  icon, label, value, isLink,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 p-2 rounded-lg bg-forest-50">{icon}</div>
      <div>
        <p className="label-overline text-ink-400 mb-0.5">{label}</p>
        {isLink ? (
          <a href={`mailto:${value}`} className="text-sm text-ink-700 hover:text-forest-700 transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-sm text-ink-700">{value}</p>
        )}
      </div>
    </div>
  );
}
