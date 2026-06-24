"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function NewPostPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState("Design");
  const [publishDate, setPublishDate] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState("Sanika Sadre");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setSessionChecked(true);
      
      // Set default local datetime for date picker
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setPublishDate(now.toISOString().slice(0, 16));
    };
    checkAuth();
  }, [router]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(slugify(val));
    setSlugManuallyEdited(true);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const calculateReadingTime = (text: string) => {
    const wpm = 200;
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
    return Math.max(1, Math.ceil(words / wpm));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !summary || !content) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setLoading(true);

    const readingTime = calculateReadingTime(content);
    const publishedAt = new Date(publishDate).toISOString();

    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          title,
          slug,
          summary,
          content,
          category,
          author_name: authorName,
          published_at: publishedAt,
          reading_time: readingTime,
        });

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Post published successfully!");
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      }
    } catch (err: any) {
      showToast(err?.message || "An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <div className="h-8 w-48 bg-foreground/10 dark:bg-white/5 rounded" />
        <div className="h-64 w-full bg-foreground/5 dark:bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-4 animate-fade-in relative">
      {/* Editor Navigation */}
      <div className="flex items-center justify-between border-b border-border-custom pb-6">
        <Link 
          href="/admin" 
          className="font-sans text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5 font-bold">←</span>
          Dashboard
        </Link>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted">
          New Story
        </span>
      </div>

      <form onSubmit={handlePublish} className="space-y-8 max-w-2xl mx-auto">
        {/* Title Input */}
        <div className="space-y-2">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Title of your story..."
            className="w-full font-serif text-3xl md:text-4xl font-black bg-transparent border-none focus:outline-none text-foreground placeholder:text-foreground/15"
          />
        </div>

        {/* Configurations Grid */}
        <div className="grid gap-6 md:grid-cols-2 p-6 rounded-2xl border border-border-custom bg-foreground/[0.01] dark:bg-white/[0.01] backdrop-blur-sm">
          {/* Slug Input */}
          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="url-slug-format"
              className="w-full font-sans text-xs px-3 py-2 rounded-lg border border-border-custom bg-transparent text-foreground placeholder:text-muted/40 focus:outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full font-sans text-xs px-3 py-2 rounded-lg border border-border-custom bg-background dark:bg-black text-foreground focus:outline-none focus:border-foreground/30 transition-colors cursor-pointer"
            >
              <option value="Design">Design</option>
              <option value="Typography">Typography</option>
              <option value="Engineering">Engineering</option>
              <option value="ML">ML</option>
              <option value="Pipeline">Pipeline</option>
            </select>
          </div>

          {/* Publish Date Time */}
          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full font-sans text-xs px-3 py-2 rounded-lg border border-border-custom bg-transparent text-foreground focus:outline-none focus:border-foreground/30 transition-colors cursor-pointer"
            />
          </div>

          {/* Author Select */}
          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
              Author
            </label>
            <select
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full font-sans text-xs px-3 py-2 rounded-lg border border-border-custom bg-background dark:bg-black text-foreground focus:outline-none focus:border-foreground/30 transition-colors cursor-pointer"
            >
              <option value="Sanika Sadre">Sanika Sadre</option>
              <option value="Gargi Harnaskar">Gargi Harnaskar</option>
            </select>
          </div>
        </div>

        {/* Summary Input */}
        <div className="space-y-2">
          <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
            Summary (Homepage snippet)
          </label>
          <textarea
            required
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A brief editorial excerpt that acts as a summary hook on the homepage..."
            className="w-full font-sans text-sm p-4 rounded-xl border border-border-custom bg-transparent text-foreground placeholder:text-muted/40 focus:outline-none focus:border-foreground/30 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Content Body Editor */}
        <div className="space-y-2">
          <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted block">
            Content Body (Supports Markdown & &lt;Note&gt; tags)
          </label>
          <textarea
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story using markdown..."
            className="w-full font-serif text-[16px] md:text-[17px] p-5 rounded-xl border border-border-custom bg-transparent text-foreground placeholder:text-muted/40 focus:outline-none focus:border-foreground/30 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-border-custom flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="font-sans text-xs font-semibold px-6 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center min-w-[120px] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </form>

      {/* Custom Sleek Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 flex items-center gap-3 ${
          toast.type === "success" 
            ? "bg-foreground/5 dark:bg-white/5 border-foreground/10 text-foreground" 
            : "bg-red-500/10 border-red-500/20 text-red-500"
        }`}>
          {toast.type === "success" ? (
            <span className="text-emerald-500 text-sm">✓</span>
          ) : (
            <span className="text-red-500 text-sm">✕</span>
          )}
          <span className="font-sans text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
