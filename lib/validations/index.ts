import { z } from "zod";

export const inquirySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  propertyId: z.string().optional(),
  message: z.string().min(10, "Please provide more detail (at least 10 characters)"),
});

export const tourRequestSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  specialRequirements: z.string().optional(),
  propertyId: z.string(),
  propertyTitle: z.string(),
});

export const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const propertySchema = z.object({
  title: z.string().min(3, "Title required"),
  tagline: z.string().optional(),
  description: z.string().min(20, "Description required"),
  narrative: z.string().optional(),
  status: z.enum(["ACTIVE","SELLING_FAST","FOR_SALE","FOR_RENT","HERITAGE","NEW_CONSTRUCTION","SOLD","ARCHIVED"]),
  type: z.enum(["DETACH","SEMI_DETACH","PENTHOUSE","ESTATE","TERRACE","APARTMENT","VILLA"]),
  askingPrice: z.number().min(1, "Price required"),
  currency: z.enum(["NGN", "USD", "GBP"]),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  sqft: z.number().min(1),
  garages: z.number().optional(),
  address: z.string().min(5),
  city: z.string().default("Abuja"),
  neighborhoodId: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  exclusive: z.boolean().default(false),
  amenityIds: z.array(z.string()).default([]),
});

export const blogPostSchema = z.object({
  title: z.string().min(5, "Title required"),
  excerpt: z.string().min(20, "Excerpt required").max(300),
  content: z.string().min(100, "Content required"),
  category: z.enum(["BUY","SELL","TRENDS","BUYING_TIPS","LIFESTYLE","INTERIOR_DESIGN","INVESTMENT","MARKET_TRENDS"]),
  readTime: z.number().min(1).default(5),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
export type TourRequestFormData = z.infer<typeof tourRequestSchema>;
export type SubscribeFormData = z.infer<typeof subscribeSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
export type BlogPostFormData = z.infer<typeof blogPostSchema>;
