import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body    = await req.json();
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.notes  && { notes: body.notes }),
        ...(body.assignedAgentId && { assignedAgentId: body.assignedAgentId }),
      },
    });
    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
