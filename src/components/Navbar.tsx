import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="mx-auto max-w-3xl px-6 md:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-sans font-semibold text-[17px] tracking-tight hover:opacity-80 transition-opacity text-foreground"
        >
          pageblogs
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            href="/team" 
            className="font-sans text-[13px] font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            Team
          </Link>
          <Link 
            href="/admin" 
            className="font-sans text-[13px] font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
