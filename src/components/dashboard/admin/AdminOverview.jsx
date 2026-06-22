'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Users, Stethoscope, Calendar, DollarSign } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAdminAnalytics } from '@/lib/api';

export default function AdminOverview() {
  useEffect(() => { document.title = 'Admin Overview | MediCare Connect'; }, []);

  const { data, isLoading } = useAsyncData(() => getAdminAnalytics(), []);
  const stats = data?.data || {};

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform overview and quick actions." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total patients" value={stats.totalPatients || 0} accent="violet" />
        <StatCard icon={Stethoscope} label="Pending doctors" value={stats.pendingDoctorCount || 0} accent="amber" subtext={stats.pendingDoctorCount > 0 ? 'Needs review' : 'All clear'} />
        <StatCard icon={Calendar} label="Today's appointments" value={stats.todaysAppointments || 0} accent="blue" />
        <StatCard icon={DollarSign} label="Total revenue" value={stats.totalRevenue || 0} subtext="USD" accent="green" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: '/admin/users', label: 'Manage users' },
          { href: '/admin/doctors', label: 'Verify doctors' },
          { href: '/admin/analytics', label: 'View analytics' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className="rounded-2xl border border-slate-200/80 bg-white p-6 font-medium text-[#5e17eb] shadow-sm transition hover:border-[#5e17eb]/30 dark:border-slate-800 dark:bg-[#111827]">
            {label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
