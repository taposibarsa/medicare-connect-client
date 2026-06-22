'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import AuthLoading, { useRoleGuard } from '@/components/RoleGuard';

export default function DashboardLayout({ children }) {
  const { session, isPending } = useRoleGuard();

  if (isPending || !session?.user) {
    return <AuthLoading />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl gap-6 px-4 py-8 sm:px-6">
      <DashboardSidebar role={session.user.role} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
