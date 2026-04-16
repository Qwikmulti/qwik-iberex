import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { propertySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function requireAdmin(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (!["ADMIN", "AGENT"].includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const page     = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
  const search   = searchParams.get("search") ?? undefined;
  const status   = searchParams.get("status") ?? undefined;

  const where: any = {
    ...(search && { OR: [
      { title: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ]}),
    ...(status && { status }),
  };

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        neighborhood: { select: { name: true } },
        _count: { select: { inquiries: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const data = propertySchema.parse(body);
    const { amenityIds, ...propertyData } = data;

    const slug = body.slug ?? slugify(data.title);

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        slug,
        askingPrice: propertyData.askingPrice,
        amenities: amenityIds?.length
          ? { create: amenityIds.map((id) => ({ amenityId: id })) }
          : undefined,
        images: body.images?.length
          ? { create: body.images }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, id: property.id, slug: property.slug }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
