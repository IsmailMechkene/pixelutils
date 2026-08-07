export default function ToolLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" role="status">
      <span className="sr-only">Loading tool</span>
      <div className="h-4 w-44 animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-8 h-11 max-w-xl animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
      <div className="mt-10 h-80 animate-pulse rounded-card border border-line bg-panel motion-reduce:animate-none" />
    </div>
  );
}
