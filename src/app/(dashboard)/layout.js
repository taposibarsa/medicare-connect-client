'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import AuthLoading, { useRoleGuard } from '@/components/RoleGuard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAdminAnalytics } from '@/lib/api';

export default function DashboardLayout({ children }) {
  const { session, isPending } = useRoleGuard();
  const role = session?.user?.role;

  const { data: analytics } = useAsyncData(
    () => (role === 'admin' ? getAdminAnalytics() : Promise.resolve(null)),
    [role]
  );

  const badges = {
    pendingDoctors: analytics?.data?.pendingDoctorCount || 0,
  };

  if (isPending || !session?.user) {
    return <AuthLoading />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-violet-50/40 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e1b4b]/30">
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <DashboardSidebar role={role} badges={badges} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
