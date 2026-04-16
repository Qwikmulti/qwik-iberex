import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Iberex Estate & Development | Luxury Real Estate in Abuja",
    template: "%s | Iberex Estate",
  },
  description:
    "Curated architectural masterpieces and heritage estates in Abuja's most prestigious neighborhoods. Redefining luxury real estate through editorial precision.",
  keywords: ["luxury real estate", "Abuja", "Nigeria", "property", "Maitama", "Asokoro"],
  authors: [{ name: "Iberex Estate & Development" }],
  creator: "Iberex Estate & Development",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Iberex Estate & Development",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-cream-100 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
