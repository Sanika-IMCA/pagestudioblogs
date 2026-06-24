"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else if (data.session) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-border-custom bg-foreground/[0.01] dark:bg-white/[0.01] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-foreground/[0.02] dark:bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              pageblogs admin
            </h1>
            <p className="font-sans text-xs text-muted">
              Enter your credentials to access the writer dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full font-sans text-sm px-4 py-2.5 rounded-lg border border-border-custom bg-transparent text-foreground placeholder:text-muted/45 focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full font-sans text-sm px-4 py-2.5 rounded-lg border border-border-custom bg-transparent text-foreground placeholder:text-muted/45 focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            {error && (
              <p className="font-sans text-xs text-red-500 text-center font-medium bg-red-500/5 py-1.5 px-3 rounded border border-red-500/10">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans text-sm font-semibold h-11 rounded-lg bg-foreground text-background hover:opacity-90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
