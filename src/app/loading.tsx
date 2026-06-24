export default function HomeLoading() {
  return (
    <div className="space-y-24 animate-pulse">
      {/* Hero Header Skeleton */}
      <section className="space-y-4 pt-4">
        <div className="h-3 w-32 bg-foreground/10 dark:bg-white/5 rounded" />
        <div className="h-10 w-full max-w-xl bg-foreground/10 dark:bg-white/5 rounded" />
        <div className="h-5 w-full max-w-md bg-foreground/5 dark:bg-white/5 rounded" />
      </section>

      {/* Hero Card Skeleton */}
      <section className="border-t border-border-custom pt-12">
        <div className="w-full rounded-2xl border border-border-custom p-8 md:p-12 bg-foreground/[0.01] dark:bg-white/[0.01] space-y-6">
          <div className="h-3.5 w-48 bg-foreground/10 dark:bg-white/5 rounded" />
          <div className="h-12 w-full max-w-2xl bg-foreground/10 dark:bg-white/5 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-foreground/5 dark:bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-foreground/5 dark:bg-white/5 rounded" />
          </div>
          <div className="h-4 w-24 bg-foreground/10 dark:bg-white/5 rounded pt-4" />
        </div>
      </section>

      {/* Grid List Skeleton */}
      <section className="border-t border-border-custom pt-12 space-y-12">
        <div className="h-3 w-28 bg-foreground/10 dark:bg-white/5 rounded" />
        
        <div className="grid gap-12 md:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-3.5 w-36 bg-foreground/10 dark:bg-white/5 rounded" />
              <div className="h-7 w-full bg-foreground/10 dark:bg-white/5 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-foreground/5 dark:bg-white/5 rounded" />
                <div className="h-4 w-4/5 bg-foreground/5 dark:bg-white/5 rounded" />
              </div>
              <div className="h-4 w-20 bg-foreground/10 dark:bg-white/5 rounded pt-2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
