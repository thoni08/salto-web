export function ThreadCardSkeleton() {
  return (
    <article className="min-h-56.25 animate-pulse overflow-hidden rounded-2xl border border-(--color-light-blue) bg-white px-4 py-4 shadow-[0_18px_30px_-28px_rgba(37,52,63,0.5)] sm:px-6 sm:py-5">
      {/* Badges Skeleton */}
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-20 rounded-full bg-slate-200" />
        <div className="h-6 w-24 rounded-full bg-slate-200" />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Avatar Skeleton */}
        <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />

        <div className="min-w-0 flex-1 space-y-3">
          {/* Author Info Skeleton */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-40 rounded bg-slate-100" />
            </div>
          </div>

          {/* Title and Excerpt Skeleton */}
          <div className="space-y-1.5">
            <div className="h-6 w-full rounded bg-slate-200" />
            <div className="h-5 w-3/4 rounded bg-slate-100" />
          </div>

          {/* Tags and Stats Skeleton */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <div className="h-6 w-14 rounded-full bg-slate-100" />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="flex gap-3">
              <div className="h-5 w-10 rounded bg-slate-100" />
              <div className="h-5 w-12 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
