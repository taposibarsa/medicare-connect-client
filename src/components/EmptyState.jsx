import { Stethoscope } from 'lucide-react';

export default function EmptyState({ title = 'No results found', message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#5e17eb]/10 text-[#5e17eb]">
        <Stethoscope size={28} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{message}</p>}
    </div>
  );
}
