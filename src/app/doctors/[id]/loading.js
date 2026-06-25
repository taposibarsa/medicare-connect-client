export default function DoctorDetailsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 md:min-h-[280px]" />
                <div className="space-y-4 p-6 md:col-span-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
