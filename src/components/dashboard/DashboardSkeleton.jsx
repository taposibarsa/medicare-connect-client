export default function DashboardSkeleton({ rows = 4 }) {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
