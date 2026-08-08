const skeletonGroups = ["primary", "secondary"] as const;
const skeletonRows = ["first", "second", "third"] as const;

export function SearchResultsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="min-h-72 p-2"
      role="status"
    >
      <span className="sr-only">Loading tool catalog</span>
      <div
        aria-hidden="true"
        className="animate-pulse motion-reduce:animate-none"
      >
        {skeletonGroups.map((group, groupIndex) => (
          <div
            className="border-t border-line px-3 py-3 first:border-t-0"
            key={group}
          >
            <div
              className={`h-3 rounded-small bg-panel-muted ${groupIndex === 0 ? "w-20" : "w-28"}`}
            />
            <div className="mt-3 grid gap-2">
              {skeletonRows
                .slice(0, groupIndex === 0 ? 3 : 2)
                .map((row, rowIndex) => (
                  <div
                    className="flex min-h-14 items-center justify-between gap-4 rounded-lg px-1"
                    key={row}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className={`h-4 rounded-small bg-panel-muted ${rowIndex === 1 ? "w-2/5" : "w-3/5"}`}
                      />
                      <div
                        className={`mt-2 h-3 rounded-small bg-panel-muted/70 ${rowIndex === 2 ? "w-1/2" : "w-4/5"}`}
                      />
                    </div>
                    <div className="size-4 shrink-0 rounded-full bg-panel-muted" />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchDialogSkeleton() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm sm:p-6">
      <div
        aria-busy="true"
        aria-live="polite"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-line bg-panel shadow-overlay"
        role="status"
      >
        <span className="sr-only">Loading search</span>
        <div
          aria-hidden="true"
          className="animate-pulse motion-reduce:animate-none"
        >
          <div className="flex h-14 items-center gap-3 border-b border-line px-4">
            <div className="size-5 rounded-full bg-panel-muted" />
            <div className="h-4 w-36 rounded-small bg-panel-muted" />
            <div className="ml-auto size-9 rounded-control bg-panel-muted" />
          </div>
          <div className="border-b border-line px-4 py-3">
            <div className="h-3 w-16 rounded-small bg-panel-muted" />
            <div className="mt-2 h-11 max-w-xs rounded-control bg-panel-muted" />
          </div>
        </div>
        <SearchResultsSkeleton />
      </div>
    </div>
  );
}
