import { Suspense } from 'react';
import FindDoctorsPage from '@/components/FindDoctorsPage';

export const metadata = {
  title: 'Find Doctors | MediCare Connect',
  description: 'Search and book verified doctors by specialization, fee, experience, and rating.',
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 py-12 dark:bg-[#0f172a]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <FindDoctorsPage />
    </Suspense>
  );
}
