// src/app/(admin)/admin/page.tsx
import Link from "next/link";
import {
  Building2, MessageSquare, Users, TrendingUp,
  ArrowRight, Clock, CheckCircle2,
} from "lucide-react";
import { getDashboardStats } from "@/lib/db/inquiries";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [stats, recentInquiries, recentProperties] = await Promise.all([
    getDashboardStats(),
    prisma.inquiry.findMany({
      where: { status: "NEW" },
      include: { property: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.property.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { neighborhood: { select: { name: true } } },
    }),
  ]);

  const statCards = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      sub: `${stats.activeListings} active`,
      icon: Building2,
      color: "text-forest-600",
      bg: "bg-forest-50",
      href: "/admin/listings",
    },
    {
      label: "New Inquiries",
      value: stats.newInquiries,
      sub: `${stats.totalInquiries} total`,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/inquiries",
    },
    {
      label: "Subscribers",
      value: stats.totalSubscribers,
      sub: "Active registrations",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/users",
    },
    {
      label: "Blog Posts",
      value: stats.publishedPosts,
      sub: `${stats.totalBlogPosts} total`,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/blog",
    },
  ];

  return (
    <div className="space-y-8 max-w-[1100px]">
      {/* Heading */}
      <div>
        <h1 className="font-display text-3xl text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-cream-200 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
              <ArrowRight size={16} className="text-ink-300 group-hover:text-ink-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="font-display text-3xl text-ink-900 mb-0.5">{card.value}</p>
            <p className="text-sm font-body font-medium text-ink-700">{card.label}</p>
            <p className="text-xs text-ink-400 mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl border border-cream-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100">
            <h2 className="font-body font-semibold text-ink-900">New Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-forest-700 hover:text-forest-900 font-body font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-cream-100">
            {recentInquiries.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle2 size={28} className="text-forest-400 mx-auto mb-2" />
                <p className="text-sm text-ink-400">All inquiries handled</p>
              </div>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-6 py-4 flex items-start gap-3 hover:bg-cream-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-ink-600 text-xs font-bold shrink-0 mt-0.5">
                    {inquiry.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-ink-900 truncate">{inquiry.fullName}</p>
                    {inquiry.property && (
                      <p className="text-xs text-ink-400 truncate">{inquiry.property.title}</p>
                    )}
                    <p className="text-xs text-ink-400 line-clamp-1 mt-0.5">{inquiry.message}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 text-2xs font-medium">NEW</span>
                    <p className="text-2xs text-ink-300 mt-1 flex items-center gap-1 justify-end">
                      <Clock size={10} /> {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-2xl border border-cream-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100">
            <h2 className="font-body font-semibold text-ink-900">Recent Listings</h2>
            <Link href="/admin/listings" className="text-xs text-forest-700 hover:text-forest-900 font-body font-medium">
              Manage →
            </Link>
          </div>
          <div className="divide-y divide-cream-100">
            {recentProperties.map((property) => (
              <Link
                key={property.id}
                href={`/admin/listings/${property.id}/edit`}
                className="px-6 py-4 flex items-center gap-3 hover:bg-cream-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-cream-200 overflow-hidden shrink-0">
                  {property.coverImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.coverImageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-ink-900 truncate group-hover:text-forest-700 transition-colors">
                    {property.title}
                  </p>
                  <p className="text-xs text-ink-400">{property.neighborhood?.name ?? property.city}</p>
                </div>
                <div className="shrink-0">
                  <span className={`badge-status text-2xs ${property.published ? "bg-forest-50 text-forest-700" : "bg-amber-50 text-amber-700"}`}>
                    {property.published ? "Live" : "Draft"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/admin/listings/new" className="flex items-center gap-3 bg-forest-700 text-cream-50 rounded-2xl p-5 hover:bg-forest-800 transition-colors">
          <Building2 size={20} />
          <div>
            <p className="font-body font-medium text-sm">New Listing</p>
            <p className="text-2xs text-forest-200">Add a property</p>
          </div>
        </Link>
        <Link href="/admin/blog/new" className="flex items-center gap-3 bg-white border border-cream-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <TrendingUp size={20} className="text-ink-600" />
          <div>
            <p className="font-body font-medium text-sm text-ink-900">New Post</p>
            <p className="text-2xs text-ink-400">Write an article</p>
          </div>
        </Link>
        <Link href="/admin/inquiries" className="flex items-center gap-3 bg-white border border-cream-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
          <MessageSquare size={20} className="text-ink-600" />
          <div>
            <p className="font-body font-medium text-sm text-ink-900">View Inbox</p>
            <p className="text-2xs text-ink-400">{stats.newInquiries} unread</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
