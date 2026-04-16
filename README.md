# Iberex Estate & Development — Fullstack Next.js App

A production-grade luxury real estate platform built with Next.js 15, Supabase, Prisma, and NextAuth v5.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom design tokens |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 5 |
| Auth | NextAuth v5 (Google OAuth) |
| Storage | Supabase Storage |
| Email | Resend |
| Rich Text | Tiptap |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Deployment | Vercel + Supabase |

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Home
│   │   ├── properties/    # Listings with filters
│   │   ├── property/[slug]/ # Property detail
│   │   ├── blog/          # Journal listing + [slug]
│   │   ├── contact/       # Contact page
│   │   └── search/        # Full-text search
│   ├── (admin)/admin/     # Protected admin dashboard
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── listings/      # CRUD for properties
│   │   ├── blog/          # CRUD for blog posts
│   │   ├── inquiries/     # Inquiry inbox
│   │   ├── media/         # Media library
│   │   ├── users/         # Team & subscribers
│   │   └── login/         # Auth page
│   └── api/
│       ├── auth/          # NextAuth handlers
│       ├── inquiries/     # Public inquiry submission
│       ├── subscribe/     # Newsletter subscribe
│       └── admin/         # Protected admin APIs
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── property/          # PropertyCard, Filters, Sort, Gallery, TourForm
│   ├── blog/              # Blog components
│   ├── admin/             # Dashboard, Tables, Forms, Editor
│   └── shared/            # ContactForm, Subscribe, Pagination, Search
├── lib/
│   ├── db/                # Prisma client + all query functions
│   ├── auth/              # NextAuth config + middleware
│   ├── utils/             # Formatters, cn(), slugify
│   └── validations/       # Zod schemas
├── types/                 # TypeScript interfaces
└── styles/                # globals.css with design tokens
prisma/
├── schema.prisma          # Full DB schema (12 models)
└── seed.ts                # Realistic seed data
```

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd iberex
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

- **DATABASE_URL** / **DIRECT_URL** — from Supabase project Settings > Database
- **NEXT_PUBLIC_SUPABASE_URL** / **NEXT_PUBLIC_SUPABASE_ANON_KEY** — from Supabase API settings
- **SUPABASE_SERVICE_ROLE_KEY** — from Supabase API settings (keep secret!)
- **NEXTAUTH_SECRET** — generate with `openssl rand -base64 32`
- **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** — from Google Cloud Console
- **RESEND_API_KEY** — from resend.com

### 3. Supabase setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket called `property-images` (set to public)
3. Copy the database URLs from Settings > Database

### 4. Database

```bash
# Push schema to Supabase
npm run db:push

# Seed with sample data
npm run db:seed

# Optional: Open Prisma Studio
npm run db:studio
```

### 5. Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 6. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

### 7. Make yourself an admin

After signing in with Google, run this in Prisma Studio or SQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Deployment

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Add all environment variables in Vercel dashboard. Set `NEXTAUTH_URL` to your production domain.

### Supabase Storage CORS

In Supabase Storage settings, add your production domain to CORS allowed origins.

## Key Features

### Public Site

- **Home** — hero, neighborhood grid, featured properties, journal preview, stats, newsletter
- **Properties Listing** — sidebar filters (price range, beds/baths, type, neighborhood), sort, pagination
- **Property Detail** — image gallery with lightbox, architectural narrative, amenities, tour request form, nearby places, related listings
- **Blog/Journal** — category tabs, featured post hero, article grid, newsletter CTA
- **Contact** — inquiry form with Resend email, map embed, studio details
- **Search** — full-text across properties and blog posts

### Admin Dashboard (protected)

- **Dashboard** — stats overview, new inquiry feed, recent listings, quick actions
- **Listings CRUD** — data table with search/filter/sort, publish toggle, bulk actions, soft delete
- **Create/Edit Listing** — tabbed form: details, media (drag-drop upload to Supabase), SEO
- **Blog CRUD** — Tiptap rich text editor, category/publish controls, live preview
- **Inquiry Inbox** — status tabs, expandable rows, inline status updates, email reply
- **Media Library** — drag-drop upload, grid view, copy URL, search
- **Users** — team members with roles, subscriber list

## Design System

Brand colors extracted from Iberex mockups:

- `forest-*` — Dark green primary (#0b1e17 → #f0f5f2)
- `cream-*` — Warm off-white backgrounds (#fafaf7 → #383430)
- `ink-*` — Near-black text (#f4f4f2 → #080807)

Fonts: **DM Serif Display** (headings) + **DM Sans** (body)

All design tokens in `tailwind.config.ts` and `src/styles/globals.css`.
