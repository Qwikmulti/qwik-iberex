// src/app/(admin)/admin/users/page.tsx
import { prisma } from "@/lib/db/prisma";
import { formatDate, getInitials } from "@/lib/utils";
import { Shield, User } from "lucide-react";

export default async function AdminUsersPage() {
  const [users, subscribers] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.subscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-8 max-w-[1100px]">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Users</h1>
        <p className="text-sm text-ink-400 mt-1 font-body">
          {users.length} team members · {subscribers.length} subscribers shown
        </p>
      </div>

      {/* Team */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-100">
          <h2 className="font-body font-semibold text-ink-900">Team Members</h2>
        </div>
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-cream-100 bg-cream-50/50">
              <th className="px-6 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">
                User
              </th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase">
                Role
              </th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden md:table-cell">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-2xs font-medium text-ink-500 tracking-wider uppercase hidden lg:table-cell">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-cream-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-cream-50 text-sm font-bold shrink-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(user.name ?? user.email ?? "U")
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">
                        {user.name ?? "—"}
                      </p>
                      <p className="text-xs text-ink-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`badge-status text-2xs ${
                      user.role === "ADMIN"
                        ? "bg-forest-50 text-forest-700"
                        : user.role === "AGENT"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-cream-100 text-ink-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4 text-ink-500 text-xs hidden md:table-cell">
                  {user.phone ?? "—"}
                </td>
                <td className="px-4 py-4 text-ink-400 text-xs hidden lg:table-cell">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subscribers */}
      <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-100 flex items-center justify-between">
          <h2 className="font-body font-semibold text-ink-900">
            Recent Subscribers
          </h2>
          <span className="badge-status bg-forest-50 text-forest-700">
            {subscribers.length} shown
          </span>
        </div>
        <div className="divide-y divide-cream-100">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="px-6 py-3 flex items-center justify-between"
            >
              <p className="text-sm text-ink-700">{sub.email}</p>
              <div className="flex items-center gap-3">
                {sub.source && (
                  <span className="badge-status bg-cream-100 text-ink-500 text-2xs">
                    {sub.source}
                  </span>
                )}
                <p className="text-xs text-ink-400">
                  {formatDate(sub.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
