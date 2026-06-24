import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate every minute

export async function generateStaticParams() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("slug");

    if (!error && posts && posts.length > 0) {
      return posts.map((post) => ({
        slug: post.slug,
      }));
    }
  } catch (err) {
    console.error("Error generating static params from Supabase, using local:", err);
  }

  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const Note = ({ children }: { children: React.ReactNode }) => (
  <div className="my-8 pl-6 pr-4 py-4 rounded-r-lg border-l-2 border-foreground bg-foreground/[0.02] dark:bg-white/[0.01] backdrop-blur-sm relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-foreground/[0.01] to-transparent pointer-events-none" />
    <div className="font-sans text-sm text-foreground/80 leading-relaxed relative z-10">
      {children}
    </div>
  </div>
);

const mdxComponents = {
  Note,
  pre: ({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) => (
    <pre 
      className="my-6 p-4 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed bg-zinc-950/90 dark:bg-zinc-950/80 backdrop-blur-md border border-white/10 text-zinc-100 shadow-xl"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.ComponentPropsWithoutRef<"code">) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code 
          className="px-1.5 py-0.5 rounded font-mono text-xs bg-foreground/5 text-foreground border border-foreground/10"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <code className={`${className} font-mono`} {...props}>{children}</code>;
  },
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="font-sans text-xl md:text-2xl font-bold tracking-tight text-foreground mt-10 mb-4" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p className="font-serif text-[17px] md:text-[18px] leading-relaxed text-foreground/90 my-6" {...props} />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="pl-6 border-l-2 border-foreground/30 italic my-8 text-lg text-foreground/80 font-serif" {...props} />
  ),
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

async function getPost(slug: string) {
  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("slug, title, content, published_at, reading_time, category, author_name")
      .eq("slug", slug)
      .single();

    if (!error && post) {
      return {
        slug: post.slug,
        title: post.title,
        content: post.content,
        date: post.published_at,
        readTime: `${post.reading_time} min read`,
        category: post.category,
        author: post.author_name,
      };
    }
  } catch (err) {
    console.error("Supabase post query error, using local fallback:", err);
  }

  return getPostBySlug(slug);
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const authorInitials = post.author
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <article className="space-y-10 pt-4 max-w-2xl mx-auto">
      {/* Header / Meta */}
      <div className="space-y-6">
        <Link 
          href="/" 
          className="font-sans text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1 group"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
          Back to Stories
        </Link>
        
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight pt-2">
          {post.title}
        </h1>
        
        {/* Author Avatar and Meta Data */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground text-background font-sans text-xs font-semibold uppercase tracking-wider select-none border border-border-custom shadow-sm transition-all duration-500 hover:scale-105">
            {authorInitials}
          </div>
          <div className="flex flex-col text-[11px]">
            <span className="font-sans font-bold text-foreground">{post.author}</span>
            <span className="font-sans text-muted font-medium flex items-center gap-1.5 mt-0.5">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span className="border border-border-custom px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider font-semibold">
                {post.category}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      <div className="pt-8 border-t border-border-custom animate-fade-in">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}

