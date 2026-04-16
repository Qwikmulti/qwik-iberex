
import type { Property, PropertyImage, Amenity, Neighborhood, BlogPost, User, Inquiry, NearbyPlace } from "@prisma/client";

// ─── Extended types with relations ───────────────────────────────────────────

export type PropertyWithRelations = Property & {
  images: PropertyImage[];
  amenities: Array<{ amenity: Amenity }>;
  neighborhood: Neighborhood | null;
  nearbyPlaces: NearbyPlace[];
  _count?: { inquiries: number };
};

export type PropertyCard = Pick<Property,
  | "id" | "title" | "slug" | "status" | "type"
  | "askingPrice" | "currency" | "bedrooms" | "bathrooms"
  | "sqft" | "address" | "city" | "coverImageUrl" | "featured" | "exclusive"
> & {
  neighborhood: Pick<Neighborhood, "name" | "slug"> | null;
};

export type BlogPostWithAuthor = BlogPost & {
  author: Pick<User, "name" | "image">;
};

export type InquiryWithRelations = Inquiry & {
  property: Pick<Property, "title" | "slug"> | null;
  assignedAgent: Pick<User, "name" | "email"> | null;
};

// ─── Filter types ─────────────────────────────────────────────────────────────

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  type?: string;
  neighborhoodSlug?: string;
  status?: string;
  search?: string;
}

export interface PropertySortOption {
  label: string;
  value: string;
  field: string;
  direction: "asc" | "desc";
}

// ─── API Response types ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

// ─── Form types ───────────────────────────────────────────────────────────────

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone?: string;
  propertyId?: string;
  message: string;
}

export interface TourRequestFormData {
  fullName: string;
  email: string;
  specialRequirements?: string;
  propertyId: string;
  propertyTitle: string;
}

export interface SubscribeFormData {
  email: string;
}

// ─── Admin types ──────────────────────────────────────────────────────────────

export interface PropertyFormData {
  title: string;
  tagline?: string;
  description: string;
  narrative?: string;
  status: string;
  type: string;
  askingPrice: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  garages?: number;
  address: string;
  city: string;
  neighborhoodId?: string;
  featured: boolean;
  published: boolean;
  exclusive: boolean;
  amenityIds: string[];
}

export interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalInquiries: number;
  newInquiries: number;
  totalSubscribers: number;
  totalBlogPosts: number;
  publishedPosts: number;
}

// ─── UI types ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
