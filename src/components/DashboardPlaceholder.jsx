export default function DashboardPlaceholder({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#111827]">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {description || 'Full dashboard features are coming in Phase 5.'}
      </p>
    </div>
  );
}
