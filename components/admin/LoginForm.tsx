"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error        = searchParams.get("error");
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/admin" });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      }) as any;

      if (result?.error) {
        setFormError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {(error || formError) && (
        <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3">
          <p className="text-sm text-red-400">
            {formError || (error === "unauthorized"
              ? "Your account does not have admin access."
              : "Authentication failed. Please try again.")}
          </p>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl",
          "bg-white text-ink-900 font-body font-medium text-sm",
          "hover:bg-cream-100 transition-colors",
          "disabled:opacity-60 disabled:cursor-not-allowed border border-ink-200"
        )}
      >
        {loading && !email ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
        )}
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-ink-900 px-3 text-xs text-ink-500 font-body uppercase tracking-widest">or</span>
        </div>
      </div>

      <form onSubmit={handleCredentialsSignIn} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-body text-ink-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" size={16} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="iberexestatesinvestment@gmail.com"
              className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-12 pr-4 py-3 text-sm text-cream-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-body text-ink-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" size={16} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-12 pr-4 py-3 text-sm text-cream-100 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-forest-700 text-cream-50 font-body font-medium text-sm hover:bg-forest-600 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && email ? <Loader2 size={18} className="animate-spin" /> : "Sign In to Dashboard"}
        </button>
      </form>
    </div>
  );
}
