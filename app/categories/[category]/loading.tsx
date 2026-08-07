export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" role="status">
      <span className="sr-only">Loading category</span>
      <div className="size-11 animate-pulse rounded-card bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-5 h-10 w-64 animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            className="h-48 animate-pulse rounded-card border border-line bg-panel motion-reduce:animate-none"
            key={item}
          />
        ))}
      </div>
    </div>
  );
}
