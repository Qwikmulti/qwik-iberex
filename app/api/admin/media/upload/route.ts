import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/db/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path     = `properties/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);

    // Track in MediaAsset table
    await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url: publicUrl,
        mimeType: file.type,
        size: file.size,
        path,
        uploadedBy: (session.user as any)?.id,
      },
    });

    return NextResponse.json({ success: true, url: publicUrl, path });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
