import { prisma } from "@/lib/db/prisma";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Media Library</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">
          {assets.length} assets
        </p>
      </div>
      <MediaLibrary assets={assets} />
    </div>
  );
}
