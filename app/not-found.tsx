import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl text-forest-200 mb-4">404</p>
        <h1 className="font-display text-3xl text-ink-900 mb-3">Page not found</h1>
        <p className="text-ink-500 font-body mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">Return Home</Link>
          <Link href="/properties" className="btn-secondary">View Listings</Link>
        </div>
      </div>
    </div>
  );
}
