/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export async function createInquiry(data: {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  source?: string;
}) {
  return prisma.inquiry.create({ data });
}

export async function getInquiriesAdmin(
  page = 1,
  pageSize = 20,
  status?: string
) {
  const where: Prisma.InquiryWhereInput = {
    ...(status && { status: status as any }),
  };

  const [data, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: {
        property: { select: { title: true, slug: true } },
        assignedAgent: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.inquiry.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function updateInquiryStatus(id: string, status: string, notes?: string) {
  return prisma.inquiry.update({
    where: { id },
    data: { status: status as any, ...(notes && { notes }) },
  });
}

export async function assignInquiry(id: string, agentId: string) {
  return prisma.inquiry.update({
    where: { id },
    data: { assignedAgentId: agentId, status: "ASSIGNED" },
  });
}

export async function getDashboardStats() {
  const [
    totalProperties, activeListings, totalInquiries,
    newInquiries, totalSubscribers, totalBlogPosts, publishedPosts
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { published: true, status: { in: ["ACTIVE", "FOR_SALE", "SELLING_FAST"] } } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.subscriber.count({ where: { active: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  return { totalProperties, activeListings, totalInquiries, newInquiries, totalSubscribers, totalBlogPosts, publishedPosts };
}
