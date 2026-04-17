/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/db/properties.ts
import { prisma } from "./prisma";
import type { PropertyFilters, PaginatedResponse, PropertyCard, PropertyWithRelations } from "@/types";
import { Prisma } from "@prisma/client";

const PROPERTY_CARD_SELECT = {
  id: true, title: true, slug: true, status: true, type: true,
  askingPrice: true, currency: true, bedrooms: true, bathrooms: true,
  sqft: true, address: true, city: true, coverImageUrl: true,
  featured: true, exclusive: true,
  neighborhood: { select: { name: true, slug: true } },
} satisfies Prisma.PropertySelect;

export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  pageSize = 12,
  sortField = "createdAt",
  sortDir: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<PropertyCard>> {
  const where: Prisma.PropertyWhereInput = {
    published: true,
    ...(filters.minPrice && { askingPrice: { gte: filters.minPrice } }),
    ...(filters.maxPrice && { askingPrice: { lte: filters.maxPrice } }),
    ...(filters.beds && { bedrooms: { gte: filters.beds } }),
    ...(filters.baths && { bathrooms: { gte: filters.baths } }),
    ...(filters.type && { type: filters.type as any }),
    ...(filters.status && { status: filters.status as any }),
    ...(filters.neighborhoodSlug && { neighborhood: { slug: filters.neighborhoodSlug } }),
    ...(filters.search && {
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      select: PROPERTY_CARD_SELECT,
      orderBy: { [sortField]: sortDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    data: data as unknown as PropertyCard[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  return prisma.property.findUnique({
    where: { slug, published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      neighborhood: true,
      nearbyPlaces: { orderBy: { sortOrder: "asc" } },
      _count: { select: { inquiries: true } },
    },
  }) as Promise<PropertyWithRelations | null>;
}

export async function getFeaturedProperties(limit = 3): Promise<PropertyCard[]> {
  return prisma.property.findMany({
    where: { published: true, featured: true },
    select: PROPERTY_CARD_SELECT,
    orderBy: { createdAt: "desc" },
    take: limit,
  }) as unknown as PropertyCard[];
}

export async function getRelatedProperties(
  propertyId: string,
  neighborhoodId: string | null,
  limit = 3
): Promise<PropertyCard[]> {
  return prisma.property.findMany({
    where: {
      published: true,
      id: { not: propertyId },
      ...(neighborhoodId && { neighborhoodId }),
    },
    select: PROPERTY_CARD_SELECT,
    orderBy: { featured: "desc" },
    take: limit,
  }) as unknown as PropertyCard[];
}

export async function getNeighborhoodProperties(
  neighborhoodSlug: string,
  limit = 6
): Promise<PropertyCard[]> {
  return prisma.property.findMany({
    where: { published: true, neighborhood: { slug: neighborhoodSlug } },
    select: PROPERTY_CARD_SELECT,
    orderBy: { featured: "desc" },
    take: limit,
  }) as unknown as PropertyCard[];
}

// ─── Admin queries ────────────────────────────────────────────────────────────

export async function getAllPropertiesAdmin(
  page = 1,
  pageSize = 20,
  search?: string,
  status?: string
) {
  const where: Prisma.PropertyWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(status && { status: status as any }),
  };

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { neighborhood: { select: { name: true } }, _count: { select: { inquiries: true } } },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createProperty(data: Prisma.PropertyCreateInput) {
  return prisma.property.create({ data });
}

export async function updateProperty(id: string, data: Prisma.PropertyUpdateInput) {
  return prisma.property.update({ where: { id }, data });
}

export async function deleteProperty(id: string) {
  return prisma.property.update({ where: { id }, data: { published: false } }); // soft delete
}
export async function getPropertyForAdminEdit(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      neighborhood: true,
    },
  });
}
