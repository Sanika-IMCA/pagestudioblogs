import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");

export interface PostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  featured: boolean;
  readTime: string;
}

export interface Post extends PostMetadata {
  content: string;
}

// Get all posts metadata, sorted by date (descending)
export function getAllPosts(): PostMetadata[] {
  // Ensure the directory exists
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  const filenames = fs.readdirSync(POSTS_DIRECTORY);
  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx") || filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const filePath = path.join(POSTS_DIRECTORY, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || "",
        author: data.author || "Anonymous",
        category: data.category || "General",
        featured: data.featured === true || data.featured === "true",
        readTime: data.readTime || "3 min read",
      } as PostMetadata;
    });

  // Sort by date (descending)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a single post by slug
export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);
  const mdPath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  let filePath = "";

  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "Untitled",
    description: data.description || "",
    date: data.date || "",
    author: data.author || "Anonymous",
    category: data.category || "General",
    featured: data.featured === true || data.featured === "true",
    readTime: data.readTime || "3 min read",
    content,
  };
}
