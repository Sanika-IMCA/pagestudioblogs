import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { supabase } from "@/lib/supabase";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Next.js App Router dynamic page setup
export const revalidate = 60; // Revalidate every minute

async function getPosts() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("slug, title, summary, published_at, reading_time, category, featured")
      .order("published_at", { ascending: false });

    if (!error && posts && posts.length > 0) {
      return posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        description: post.summary,
        date: post.published_at,
        readTime: `${post.reading_time} min read`,
        category: post.category,
        featured: post.featured === true || post.featured === "true" || String(post.featured) === "true",
      }));
    }
  } catch (err) {
    console.error("Supabase query error, using local fallback:", err);
  }

  // Fallback to local files
  return getAllPosts();
}

export default async function Home() {
  const posts = await getPosts();
  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const regularPosts = posts.filter((post) => post.slug !== featuredPost?.slug);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="space-y-4 pt-4 animate-fade-in">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted block">
          Editorial & Perspectives
        </span>
        <h1 className="font-sans text-4xl md:text-5xl font-black tracking-tight max-w-xl text-foreground">
          Writing on design, code, and simplicity.
        </h1>
        <p className="font-sans text-base text-muted max-w-md leading-relaxed">
          Welcome to pageblogs. An open canvas dedicated to high-end design, elegant engineering, and long-form thought.
        </p>
      </section>

      {/* Hero Editorial Card */}
      {featuredPost && (
        <section className="border-t border-border-custom pt-12 animate-fade-in">
          <Link 
            href={`/blog/${featuredPost.slug}`} 
            className="group block relative rounded-2xl overflow-hidden bg-foreground/[0.01] dark:bg-white/[0.01] border border-border-custom p-8 md:p-12 transition-all duration-700 ease-out hover:scale-[1.01] hover:opacity-95 hover:shadow-2xl hover:shadow-black/[0.02] dark:hover:shadow-white/[0.02]"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-muted font-sans">
                <span className="text-foreground uppercase tracking-widest">{featuredPost.category}</span>
                <span>•</span>
                <span>{formatDate(featuredPost.date)}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight text-foreground group-hover:text-muted transition-colors duration-500">
                {featuredPost.title}
              </h2>
              
              <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/80 max-w-2xl font-light">
                {featuredPost.description}
              </p>
              
              <div className="pt-4 flex items-center gap-1 font-sans text-sm font-bold text-foreground">
                <span>Read article</span>
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid List of Regular Posts */}
      {regularPosts.length > 0 && (
        <section className="border-t border-border-custom pt-12 space-y-12 animate-fade-in">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted">
            Recent Stories
          </h3>
          
          <div className="grid gap-12 md:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
            {regularPosts.map((post) => (
              <article key={post.slug} className="group relative flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-foreground/[0.04] dark:bg-white/[0.04] border border-border-custom backdrop-blur-sm text-foreground/90">
                      {post.category}
                    </span>
                    <span className="font-sans text-[11px] font-medium text-muted">
                      {formatDate(post.date)}
                    </span>
                    <span className="text-muted text-[11px]">•</span>
                    <span className="font-sans text-[11px] font-medium text-muted">
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block">
                    <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground group-hover:text-muted transition-colors duration-500 leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="font-sans text-sm leading-relaxed text-muted/90 font-normal">
                    {post.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="font-sans text-xs font-bold uppercase tracking-wider text-foreground hover:text-muted transition-colors duration-300 inline-flex items-center gap-1 group/btn"
                  >
                    Read story 
                    <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


