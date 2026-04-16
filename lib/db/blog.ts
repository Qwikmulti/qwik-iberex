import { prisma } from "./prisma";
import type { BlogPostWithAuthor, PaginatedResponse } from "@/types";
import { Prisma } from "@prisma/client";

export async function getBlogPosts(
  category?: string,
  page = 1,
  pageSize = 9
): Promise<PaginatedResponse<BlogPostWithAuthor>> {
  const where: Prisma.BlogPostWhereInput = {
    published: true,
    ...(category && category !== "ALL" && { category: category as any }),
  };

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true, image: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    data: data as BlogPostWithAuthor[],
    total, page, pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, image: true } } },
  }) as Promise<BlogPostWithAuthor | null>;
}

export async function getFeaturedBlogPost(): Promise<BlogPostWithAuthor | null> {
  return prisma.blogPost.findFirst({
    where: { published: true, featured: true },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { publishedAt: "desc" },
  }) as Promise<BlogPostWithAuthor | null>;
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPostWithAuthor[]> {
  return prisma.blogPost.findMany({
    where: { published: true },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  }) as Promise<BlogPostWithAuthor[]>;
}

