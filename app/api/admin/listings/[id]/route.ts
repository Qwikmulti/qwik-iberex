import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session) return false;
  const role = (session.user as any)?.role;
  return ["ADMIN", "AGENT"].includes(role);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { amenityIds, images, ...updateData } = body;

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        // Replace amenities if provided
        ...(amenityIds !== undefined && {
          amenities: {
            deleteMany: {},
            create: amenityIds.map((amenityId: string) => ({ amenityId })),
          },
        }),
        // Replace images if provided
        ...(images !== undefined && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
      },
    });

    return NextResponse.json({ success: true, id: property.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    // Soft delete - just unpublish and archive
    await prisma.property.update({
      where: { id },
      data: { published: false, status: "ARCHIVED" },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
