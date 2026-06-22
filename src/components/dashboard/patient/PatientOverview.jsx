'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, CreditCard, Star, Clock } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAppointments, getPayments, getMyReviews } from '@/lib/api';
import { formatDateTime, isUpcoming, getDoctorId } from '@/lib/dashboardUtils';

export default function PatientOverview() {
  useEffect(() => {
    document.title = 'Patient Overview | MediCare Connect';
  }, []);

  const { data: apptData, isLoading: apptLoading } = useAsyncData(() => getAppointments(), []);
  const { data: payData, isLoading: payLoading } = useAsyncData(() => getPayments(), []);
  const { data: reviewData, isLoading: reviewLoading } = useAsyncData(() => getMyReviews(), []);

  const isLoading = apptLoading || payLoading || reviewLoading;
  const appointments = apptData?.data || [];
  const upcoming = appointments.filter(
    (a) => isUpcoming(a.appointmentDate) && ['pending', 'accepted'].includes(a.appointmentStatus)
  );
  const history = appointments.filter(
    (a) => !isUpcoming(a.appointmentDate) || ['completed', 'cancelled', 'rejected'].includes(a.appointmentStatus)
  ).slice(0, 5);
  const totalSpent = payData?.total || 0;

  const favoriteMap = {};
  appointments
    .filter((a) => a.appointmentStatus === 'completed')
    .forEach((a) => {
      const id = getDoctorId(a);
      if (!id) return;
      favoriteMap[id] = favoriteMap[id] || { doctor: a.doctorId, count: 0 };
      favoriteMap[id].count += 1;
    });
  const favorites = Object.values(favoriteMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="Welcome back"
        description="Track your appointments, payments, and care history in one place."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Calendar} label="Upcoming" value={upcoming.length} accent="violet" />
        <StatCard icon={Clock} label="Past visits" value={history.length} accent="blue" />
        <StatCard icon={CreditCard} label="Total spent" value={totalSpent} suffix="" subtext="USD" accent="green" />
        <StatCard icon={Star} label="Reviews written" value={reviewData?.data?.length || 0} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming appointments</h2>
            <Link href="/patient/appointments" className="text-sm font-medium text-[#5e17eb] hover:underline">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState title="No upcoming appointments" message="Book a doctor to get started." />
          ) : (
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((appt) => (
                <li key={appt._id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{appt.doctorId?.doctorName}</p>
                    <p className="text-sm text-slate-500">{formatDateTime(appt.appointmentDate, appt.appointmentTime)}</p>
                  </div>
                  <StatusBadge status={appt.appointmentStatus} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Favorite doctors</h2>
          {favorites.length === 0 ? (
            <EmptyState title="No favorites yet" message="Complete an appointment to see your most visited doctors." />
          ) : (
            <ul className="space-y-3">
              {favorites.map(({ doctor, count }) => (
                <li key={doctor._id}>
                  <Link href={`/doctors/${doctor._id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-[#5e17eb]/30 hover:bg-violet-50/50 dark:border-slate-800 dark:hover:bg-[#5e17eb]/5">
                    <Image
                      src={doctor.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.doctorName)}
                      alt={doctor.doctorName}
                      width={44}
                      height={44}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">{doctor.doctorName}</p>
                      <p className="text-sm text-slate-500">{doctor.specialization} · {count} visit{count > 1 ? 's' : ''}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
