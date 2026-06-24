"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface DashboardPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  published_at: string;
  reading_time: number;
}

export default function AdminDashboardPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(session.user.email || null);
      setSessionChecked(true);

      // Fetch posts
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, slug, category, published_at, reading_time")
          .order("published_at", { ascending: false });

        if (!error && data) {
          setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching dashboard posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (!sessionChecked) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <div className="h-8 w-48 bg-foreground/10 dark:bg-white/5 rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full bg-foreground/5 dark:bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-4 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-sans text-3xl font-black text-foreground">
            Writer Dashboard
          </h1>
          <p className="font-sans text-xs text-muted">
            Logged in as <span className="font-semibold text-foreground">{userEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="font-sans text-xs font-semibold px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center h-9"
          >
            New Post
          </Link>
          <button
            onClick={handleSignOut}
            className="font-sans text-xs font-semibold px-4 py-2 rounded-lg border border-border-custom hover:bg-foreground/5 transition-all duration-300 h-9"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <section className="border-t border-border-custom pt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted">
            Manage Stories
          </h2>
          <span className="font-sans text-[11px] text-muted">
            {posts.length} {posts.length === 1 ? "story" : "stories"} total
          </span>
        </div>

        {loadingPosts ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 w-full bg-foreground/5 dark:bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-border-custom">
            <p className="font-sans text-sm text-muted">No posts found in the database.</p>
            <Link
              href="/admin/new"
              className="font-sans text-xs font-semibold text-foreground underline mt-2 block"
            >
              Write your first story
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-custom">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group transition-all duration-300"
              >
                <div className="space-y-1 max-w-xl">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="font-serif text-lg font-bold text-foreground group-hover:text-muted transition-colors duration-300 block"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2.5 text-xs text-muted font-sans">
                    <span className="font-semibold uppercase tracking-widest text-[9px] px-1.5 py-0.2 rounded bg-foreground/[0.04] dark:bg-white/[0.04] border border-border-custom">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.published_at)}</span>
                    <span>•</span>
                    <span>{post.reading_time} min read</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-sans text-xs font-medium text-muted hover:text-foreground underline decoration-transparent hover:decoration-current transition-all"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
