'use client';

import { useEffect } from 'react';
import { Users, Calendar, Star } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import StarRating from '@/components/StarRating';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getMyDoctorProfile, getAppointments } from '@/lib/api';
import { formatDateTime, isToday, getPatientId } from '@/lib/dashboardUtils';

export default function DoctorOverview() {
  useEffect(() => { document.title = 'Doctor Overview | MediCare Connect'; }, []);

  const { data: doctorData, isLoading: dLoading } = useAsyncData(() => getMyDoctorProfile(), []);
  const { data: apptData, isLoading: aLoading } = useAsyncData(() => getAppointments(), []);

  const doctor = doctorData?.data;
  const appointments = apptData?.data || [];
  const uniquePatients = new Set(appointments.map((a) => getPatientId(a)).filter(Boolean)).size;
  const todays = appointments.filter((a) => isToday(a.appointmentDate) && ['pending', 'accepted'].includes(a.appointmentStatus));
  const pending = appointments.filter((a) => a.appointmentStatus === 'pending');

  if (dLoading || aLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title={`Hello, Dr. ${doctor?.doctorName || ''}`} description="Manage your practice from one dashboard." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total patients" value={uniquePatients} accent="violet" />
        <StatCard icon={Calendar} label="Today's appointments" value={todays.length} accent="blue" />
        <StatCard icon={Calendar} label="Pending requests" value={pending.length} accent="amber" />
        <StatCard icon={Star} label="Avg rating" value={doctor?.avgRating || 0} subtext={`${doctor?.reviewCount || 0} reviews`} accent="green" />
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <h2 className="mb-4 text-lg font-semibold">Today's schedule</h2>
        {todays.length === 0 ? (
          <EmptyState title="No appointments today" message="Enjoy your day off or check pending requests." />
        ) : (
          <ul className="space-y-3">
            {todays.map((a) => (
              <li key={a._id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <div>
                  <p className="font-medium">{a.patientId?.name}</p>
                  <p className="text-sm text-slate-500">{formatDateTime(a.appointmentDate, a.appointmentTime)}</p>
                </div>
                <StatusBadge status={a.appointmentStatus} />
              </li>
            ))}
          </ul>
        )}
        {doctor?.avgRating > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="text-sm text-slate-500">Your rating</p>
            <StarRating rating={doctor.avgRating} />
          </div>
        )}
      </section>
    </div>
  );
}
