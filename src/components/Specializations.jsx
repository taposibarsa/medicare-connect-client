import Link from 'next/link';
import { Heart, Brain, Bone, Baby, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';

const specializations = [
  { name: 'Cardiology', icon: Heart, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { name: 'Neurology', icon: Brain, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Orthopedics', icon: Bone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Pediatrics', icon: Baby, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
  { name: 'Dermatology', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
];

export default function Specializations() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-[#0f172a] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Medical Specializations"
          subtitle="Browse doctors by specialty and find the right expert for your condition."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {specializations.map(({ name, icon: Icon, color }) => (
            <Link
              key={name}
              href={`/find-doctors?specialization=${encodeURIComponent(name)}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-[#5e17eb]/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={28} />
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-[#5e17eb] dark:text-white">
                {name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
