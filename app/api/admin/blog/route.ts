import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session) return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body   = await req.json();
    const slug   = body.slug ?? slugify(body.title);
    const userId = (session.user as any)?.id ?? body.authorId;

    const post = await prisma.blogPost.create({
      data: {
        title:       body.title,
        slug,
        excerpt:     body.excerpt,
        content:     body.content,
        category:    body.category,
        coverImage:  body.coverImage,
        readTime:    body.readTime ?? 5,
        featured:    body.featured ?? false,
        published:   body.published ?? false,
        publishedAt: body.published ? new Date() : null,
        authorId:    userId,
      },
    });

    return NextResponse.json({ success: true, id: post.id, slug: post.slug }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
