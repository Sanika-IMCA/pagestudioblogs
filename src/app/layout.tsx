import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const loraSerif = Lora({
  variable: "--font-lora-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PageBlogs — Premium Minimalist Blogging Platform",
  description: "A premium, minimalist blogging platform featuring Apple-style aesthetic, razor-sharp typography, and long-form reading experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${loraSerif.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col pt-24 pb-12 w-full animate-fade-in">
          <div className="mx-auto max-w-3xl px-6 md:px-8 w-full flex-1 flex flex-col">
            {children}
          </div>
        </main>
        <footer className="w-full border-t border-border-custom bg-background/50 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-6 md:px-8 py-8 flex items-center justify-between text-[11px] font-sans text-muted">
            <span>© 2026 pageblogs.</span>
            <span className="font-medium tracking-tight">Documenting the build.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

