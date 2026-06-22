import AnimatedCounter from '@/components/AnimatedCounter';

export default function StatCard({ icon: Icon, label, value, suffix = '', subtext, accent = 'violet' }) {
  const accents = {
    violet: 'bg-[#5e17eb]/10 text-[#5e17eb]',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
          {subtext && (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtext}</p>
          )}
        </div>
        {Icon && (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent] || accents.violet}`}>
            <Icon size={22} />
          </span>
        )}
      </div>
    </div>
  );
}
