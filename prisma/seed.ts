/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, PropertyStatus, PropertyType, BlogCategory, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Amenities ───────────────────────────────────────────────────────────────
  const amenities = await Promise.all([
    prisma.amenity.upsert({ where: { slug: "infinity-pool" }, update: {}, create: { name: "Infinity Pool", slug: "infinity-pool", icon: "Waves", category: "Outdoor" } }),
    prisma.amenity.upsert({ where: { slug: "private-cinema" }, update: {}, create: { name: "Private Cinema", slug: "private-cinema", icon: "Film", category: "Entertainment" } }),
    prisma.amenity.upsert({ where: { slug: "wellness-gym" }, update: {}, create: { name: "Wellness Gym", slug: "wellness-gym", icon: "Dumbbell", category: "Wellness" } }),
    prisma.amenity.upsert({ where: { slug: "smart-ecosystem" }, update: {}, create: { name: "Smart Ecosystem", slug: "smart-ecosystem", icon: "Cpu", category: "Technology" } }),
    prisma.amenity.upsert({ where: { slug: "climate-cellar" }, update: {}, create: { name: "Climate Cellar", slug: "climate-cellar", icon: "Wind", category: "Storage" } }),
    prisma.amenity.upsert({ where: { slug: "car-gallery" }, update: {}, create: { name: "10-Car Gallery", slug: "car-gallery", icon: "Car", category: "Garage" } }),
    prisma.amenity.upsert({ where: { slug: "biometric-security" }, update: {}, create: { name: "Biometric Security", slug: "biometric-security", icon: "Shield", category: "Security" } }),
    prisma.amenity.upsert({ where: { slug: "steam-sauna" }, update: {}, create: { name: "Steam & Sauna", slug: "steam-sauna", icon: "Flame", category: "Wellness" } }),
    prisma.amenity.upsert({ where: { slug: "wine-cellar" }, update: {}, create: { name: "Wine Cellar", slug: "wine-cellar", icon: "Wine", category: "Entertainment" } }),
    prisma.amenity.upsert({ where: { slug: "home-office" }, update: {}, create: { name: "Home Office", slug: "home-office", icon: "Monitor", category: "Work" } }),
  ]);

  // ─── Neighborhoods ────────────────────────────────────────────────────────────
  const maitama = await prisma.neighborhood.upsert({
    where: { slug: "maitama" },
    update: {},
    create: {
      name: "Maitama",
      slug: "maitama",
      description: "Home to the city's diplomatic corps and national leadership, this neighborhood offers unparalleled security, manicured boulevards, and a quietude that belies its proximity to the capital's center.",
      tagline: "Diplomatic Enclave",
      imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      city: "Abuja", state: "FCT", country: "Nigeria",
      featured: true, sortOrder: 1,
    },
  });

  const asokoro = await prisma.neighborhood.upsert({
    where: { slug: "asokoro" },
    update: {},
    create: {
      name: "Asokoro",
      slug: "asokoro",
      description: "Elite residences in the heart of Abuja, where distinguished architecture meets the serenity of manicured estates.",
      tagline: "Elite Residences",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      city: "Abuja", state: "FCT", country: "Nigeria",
      featured: true, sortOrder: 2,
    },
  });

  const guzape = await prisma.neighborhood.upsert({
    where: { slug: "guzape" },
    update: {},
    create: {
      name: "Guzape",
      slug: "guzape",
      description: "Nigeria's elevation district, offering panoramic views of the capital's skyline from its prestigious hillside perches.",
      tagline: "Nigerian Elevation",
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      city: "Abuja", state: "FCT", country: "Nigeria",
      featured: true, sortOrder: 3,
    },
  });

  const wuye = await prisma.neighborhood.upsert({
    where: { slug: "wuye" },
    update: {},
    create: {
      name: "Wuye",
      slug: "wuye",
      description: "A modern residential district that blends urban convenience with quiet suburban sensibility.",
      tagline: "Modern District",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      city: "Abuja", state: "FCT", country: "Nigeria",
      featured: false, sortOrder: 4,
    },
  });

  // ─── Admin user ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@iberexestate.com" },
    update: {},
    create: {
      name: "Amana Okafor",
      email: "admin@iberexestate.com",
      role: UserRole.ADMIN,
      phone: "+234 803 060 0177",
      bio: "Principal Consultant at Iberex Estate & Development",
    },
  });

  // ─── Properties ───────────────────────────────────────────────────────────────
  const tenssiPavilion = await prisma.property.upsert({
    where: { slug: "the-tenssi-pavilion" },
    update: {},
    create: {
      title: "The Tenssi Pavilion",
      slug: "the-tenssi-pavilion",
      tagline: "A masterpiece of basalt and light, redefining the architectural landscape of Abuja's most prestigious enclave.",
      description: "A masterpiece of basalt and light, redefining the architectural landscape of Abuja's most prestigious enclave.",
      narrative: `The Obsidian Pavilion is not merely a residence; it is a profound architectural statement carved from the vision of tranquility and power. Located in the heart of Maitama, this estate utilizes a palette of dark volcanic stone, brushed steel, and triple-glazed expansive glass to create a sanctuary that is both imposing and ethereal.

Upon entry, the double-height atrium introduces a sense of boundless volume, where a cantilevered marble staircase appears to float against a backdrop of indoor vertical gardens. The flow is intentional, guiding the eye toward the horizon-line pool that merges seamlessly with the manicured grounds.

Every detail, from the smart-integrated climate control systems to the bespoke kitchen by Boffi, has been curated for the individual who demands excellence without compromise. The master suite occupies its own wing, featuring a private terrace overlooking the Abuja skyline.`,
      status: PropertyStatus.FOR_SALE,
      type: PropertyType.ESTATE,
      askingPrice: 4200000000,
      currency: "NGN",
      bedrooms: 7,
      bathrooms: 9,
      sqft: 12450,
      garages: 10,
      address: "Plot 24, Maitama District",
      city: "Abuja", state: "FCT", country: "Nigeria",
      latitude: 9.0765, longitude: 7.4983,
      neighborhoodId: maitama.id,
      featured: true, published: true, exclusive: true,
      coverImageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    },
  });

  // Add amenities to tenssi pavilion
  for (const amenity of amenities) {
    await prisma.propertyAmenity.upsert({
      where: { propertyId_amenityId: { propertyId: tenssiPavilion.id, amenityId: amenity.id } },
      update: {},
      create: { propertyId: tenssiPavilion.id, amenityId: amenity.id },
    });
  }

  // Add nearby places
  await prisma.nearbyPlace.createMany({
    skipDuplicates: true,
    data: [
      { propertyId: tenssiPavilion.id, name: "IBB Golf Club", distance: "5 mins", type: "golf", sortOrder: 1 },
      { propertyId: tenssiPavilion.id, name: "Central Business District", distance: "10 mins", type: "business", sortOrder: 2 },
      { propertyId: tenssiPavilion.id, name: "Hilton Transcorp", distance: "2 mins", type: "hotel", sortOrder: 3 },
    ],
  });

  // Add images
  await prisma.propertyImage.createMany({
    skipDuplicates: true,
    data: [
      { propertyId: tenssiPavilion.id, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200", isCover: true, sortOrder: 0, altText: "Main Pavilion" },
      { propertyId: tenssiPavilion.id, url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800", isCover: false, sortOrder: 1, altText: "Living Area" },
      { propertyId: tenssiPavilion.id, url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", isCover: false, sortOrder: 2, altText: "Pool" },
    ],
  });

  // More properties
  const properties = [
    {
      title: "The Obsidian Pavilion",
      slug: "the-obsidian-pavilion",
      description: "Ultra-modern luxury meets Nigerian architectural heritage in Kensington Gardens.",
      narrative: "A vision of architectural purity set within Abuja's most prestigious gated community.",
      status: PropertyStatus.NEW_CONSTRUCTION,
      type: PropertyType.ESTATE,
      askingPrice: 4250000,
      currency: "NGN",
      bedrooms: 5, bathrooms: 4, sqft: 5200,
      address: "Kensington Gardens, Life Camp",
      neighborhoodId: wuye.id,
      coverImageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200",
      featured: true, published: true, exclusive: false,
    },
    {
      title: "Skyline Loft 402",
      slug: "skyline-loft-402",
      description: "Contemporary penthouse living with panoramic city views.",
      status: PropertyStatus.SELLING_FAST,
      type: PropertyType.PENTHOUSE,
      askingPrice: 4250000,
      currency: "NGN",
      bedrooms: 2, bathrooms: 2, sqft: 1850,
      address: "Shoreditch, Katampe",
      neighborhoodId: guzape.id,
      coverImageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      featured: true, published: true, exclusive: false,
    },
    {
      title: "Azure Heights Manor",
      slug: "azure-heights-manor",
      description: "A timeless estate defined by sweeping terraces and verdant gardens.",
      status: PropertyStatus.SELLING_FAST,
      type: PropertyType.ESTATE,
      askingPrice: 4250000,
      currency: "NGN",
      bedrooms: 6, bathrooms: 7, sqft: 9400,
      address: "Belgravia Square, Katampe Extension",
      neighborhoodId: guzape.id,
      coverImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
      featured: true, published: true, exclusive: true,
    },
    {
      title: "The Ivory Solarium",
      slug: "the-ivory-solarium",
      description: "Bathed in natural light, this immaculate residence commands the Asokoro skyline.",
      status: PropertyStatus.FOR_SALE,
      type: PropertyType.DETACH,
      askingPrice: 2800000000,
      currency: "NGN",
      bedrooms: 5, bathrooms: 5, sqft: 6800,
      address: "Asokoro District",
      neighborhoodId: asokoro.id,
      coverImageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200",
      featured: false, published: true, exclusive: false,
    },
    {
      title: "The Tinkatan",
      slug: "the-tinkatan",
      description: "Heritage architecture reborn for the contemporary visionary.",
      status: PropertyStatus.HERITAGE,
      type: PropertyType.ESTATE,
      askingPrice: 2800000000,
      currency: "NGN",
      bedrooms: 6, bathrooms: 6, sqft: 8200,
      address: "Wuye District",
      neighborhoodId: wuye.id,
      coverImageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      featured: false, published: true, exclusive: false,
    },
    {
      title: "The Glass Pavilion",
      slug: "the-glass-pavilion",
      description: "Floor-to-ceiling glass frames the Abuja landscape in this architectural triumph.",
      status: PropertyStatus.ACTIVE,
      type: PropertyType.VILLA,
      askingPrice: 12450000,
      currency: "USD",
      bedrooms: 6, bathrooms: 5, sqft: 8900,
      address: "Jahi District",
      neighborhoodId: maitama.id,
      coverImageUrl: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=1200",
      featured: false, published: true, exclusive: false,
    },
    {
      title: "Observatory Residence",
      slug: "observatory-residence",
      description: "A cliff-top sanctuary offering uninterrupted views of the capital.",
      status: PropertyStatus.FOR_SALE,
      type: PropertyType.VILLA,
      askingPrice: 8900000,
      currency: "USD",
      bedrooms: 4, bathrooms: 5, sqft: 5450,
      address: "Jahi District",
      neighborhoodId: maitama.id,
      coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      featured: false, published: true, exclusive: false,
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: prop as any,
    });
  }

  // ─── Blog Posts ───────────────────────────────────────────────────────────────
  const blogPosts = [
    {
      title: "The Rise of Wellness-Focused Architecture in Urban Centers",
      slug: "rise-of-wellness-architecture",
      excerpt: "How biophilic design and integrated air filtration systems are becoming the new gold standard for luxury residential developments in 2024.",
      content: "<h2>The Wellness Revolution</h2><p>How biophilic design and integrated air filtration systems are becoming the new gold standard for luxury residential developments in 2024. Nigerian architects are increasingly incorporating natural materials and green spaces.</p>",
      category: BlogCategory.MARKET_TRENDS,
      coverImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200",
      readTime: 8, featured: true, published: true,
      publishedAt: new Date("2024-11-15"),
    },
    {
      title: "Curating Silence: The Aesthetics of Minimalist Living",
      slug: "aesthetics-of-minimalist-living",
      excerpt: "Discover how high-net-worth individuals are opting for reductive interiors that prioritize quality over quantity.",
      content: "<h2>Less Is More</h2><p>Discover how high-net-worth individuals are opting for reductive interiors that prioritize quality over quantity in Nigerian luxury homes.</p>",
      category: BlogCategory.INTERIOR_DESIGN,
      coverImage: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
      readTime: 6, featured: false, published: true,
      publishedAt: new Date("2024-11-10"),
    },
    {
      title: "Navigating Luxury Off-Market Opportunities",
      slug: "luxury-off-market-opportunities",
      excerpt: "Insights into the exclusive world of private real estate listings and how to gain access to the most coveted properties before they hit the market.",
      content: "<h2>The Private Market</h2><p>Insights into the exclusive world of private real estate listings and how to gain access to the most coveted properties in Abuja.</p>",
      category: BlogCategory.BUYING_TIPS,
      coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      readTime: 5, featured: false, published: true,
      publishedAt: new Date("2024-11-05"),
    },
    {
      title: "Why 2024 is the Year of the Digital Estate",
      slug: "year-of-digital-estate-2024",
      excerpt: "How blockchain and smart contracts are revolutionizing real estate transactions in Nigeria.",
      content: "<h2>Digital Transformation</h2><p>How blockchain and smart contracts are revolutionizing real estate transactions in Nigeria, creating new opportunities for investors.</p>",
      category: BlogCategory.INVESTMENT,
      coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
      readTime: 4, featured: false, published: true,
      publishedAt: new Date("2024-10-28"),
    },
    {
      title: "The Rise of Sustainable Luxury in Guzape Hills",
      slug: "sustainable-luxury-guzape",
      excerpt: "How eco-conscious luxury design is driving property values in Abuja's high-altitude districts.",
      content: "<h2>Sustainable Living</h2><p>How eco-conscious luxury design is driving property values in Abuja's most elevated neighborhoods.</p>",
      category: BlogCategory.MARKET_TRENDS,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      readTime: 5, featured: false, published: true,
      publishedAt: new Date("2024-10-20"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, authorId: admin.id },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
  