'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAppointments } from '@/lib/api';
import { formatDateTime } from '@/lib/dashboardUtils';

export default function AdminAppointments() {
  useEffect(() => { document.title = 'Appointments | Admin Dashboard | MediCare Connect'; }, []);

  const { data, isLoading } = useAsyncData(() => getAppointments(), []);
  const [filter, setFilter] = useState('all');
  const appointments = data?.data || [];
  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.appointmentStatus === filter);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="All Appointments" description="Monitor appointment activity across the platform." />

      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'pending', 'accepted', 'completed', 'cancelled', 'rejected'].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${filter === f ? 'bg-[#5e17eb] text-white' : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111827]'}`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No appointments" />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a._id} className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#111827]">
              <div>
                <p className="font-medium">{a.patientId?.name} → {a.doctorId?.doctorName}</p>
                <p className="text-sm text-slate-500">{formatDateTime(a.appointmentDate, a.appointmentTime)}</p>
              </div>
              <StatusBadge status={a.appointmentStatus} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
