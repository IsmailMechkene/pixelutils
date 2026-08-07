export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" role="status">
      <span className="sr-only">Loading page</span>
      <div className="h-4 w-28 animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-6 h-10 max-w-xl animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-10 h-64 animate-pulse rounded-card border border-line bg-panel motion-reduce:animate-none" />
    </div>
  );
}
