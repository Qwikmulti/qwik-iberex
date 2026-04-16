import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-display text-cream-50 text-xl mb-1">
            IBEREX <span className="font-body font-medium text-sm tracking-widest">LTD</span>
          </p>
          <p className="text-ink-400 text-sm font-body">Admin Portal</p>
        </div>

        <div className="bg-ink-900 rounded-2xl border border-ink-700 p-8">
          <h1 className="font-display text-2xl text-cream-50 mb-2">Sign in</h1>
          <p className="text-ink-400 text-sm font-body mb-8">
            Access the Iberex dashboard to manage listings and inquiries.
          </p>
          <LoginForm />
        </div>

        <p className="text-center text-ink-600 text-xs mt-6 font-body">
          © {new Date().getFullYear()} Iberex Estate & Development
        </p>
      </div>
    </div>
  );
}
