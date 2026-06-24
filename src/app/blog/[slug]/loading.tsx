export default function BlogPostLoading() {
  return (
    <div className="space-y-10 pt-4 max-w-2xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-6">
        <div className="h-3.5 w-24 bg-foreground/10 dark:bg-white/5 rounded" />
        <div className="h-12 w-full bg-foreground/10 dark:bg-white/5 rounded" />
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-foreground/10 dark:bg-white/5" />
          <div className="flex flex-col gap-1.5 w-48">
            <div className="h-3 w-1/3 bg-foreground/10 dark:bg-white/5 rounded" />
            <div className="h-3 w-full bg-foreground/5 dark:bg-white/5 rounded" />
          </div>
        </div>
      </div>

      {/* Body text skeleton */}
      <div className="pt-8 border-t border-border-custom space-y-6">
        <div className="h-4 w-full bg-foreground/5 dark:bg-white/5 rounded" />
        <div className="h-4 w-5/6 bg-foreground/5 dark:bg-white/5 rounded" />
        <div className="h-4 w-full bg-foreground/5 dark:bg-white/5 rounded" />
        <div className="h-4 w-11/12 bg-foreground/5 dark:bg-white/5 rounded" />
        <div className="h-4 w-4/5 bg-foreground/5 dark:bg-white/5 rounded" />
      </div>
    </div>
  );
}
