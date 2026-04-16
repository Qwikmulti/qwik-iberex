/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { subscribeSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = req.headers.get("content-type")?.includes("application/json")
      ? await req.json()
      : Object.fromEntries(await req.formData());

    const { email } = subscribeSchema.parse(body);

    await prisma.subscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, source: body.source ?? "website" },
    });

    // Redirect for form submissions
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.redirect(new URL("/blog?subscribed=1", req.url));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
