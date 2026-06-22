'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAppointments, acceptAppointment, rejectAppointment, completeAppointment } from '@/lib/api';
import { formatDateTime } from '@/lib/dashboardUtils';

export default function DoctorAppointments() {
  useEffect(() => { document.title = 'Appointments | Doctor Dashboard | MediCare Connect'; }, []);
  const router = useRouter();
  const [tab, setTab] = useState('pending');
  const [loadingId, setLoadingId] = useState(null);
  const { data, isLoading, refetch } = useAsyncData(() => getAppointments(), []);

  const appointments = data?.data || [];
  const filtered = appointments.filter((a) => {
    if (tab === 'pending') return a.appointmentStatus === 'pending';
    if (tab === 'accepted') return a.appointmentStatus === 'accepted';
    if (tab === 'completed') return a.appointmentStatus === 'completed';
    return a.appointmentStatus === 'rejected';
  });

  const runAction = async (id, action) => {
    setLoadingId(id);
    try {
      if (action === 'accept') {
        await acceptAppointment(id);
        toast.success('Appointment accepted');
      } else if (action === 'reject') {
        await rejectAppointment(id);
        toast.success('Appointment rejected');
      } else if (action === 'complete') {
        await completeAppointment(id);
        toast.success('Marked completed — create a prescription');
        router.push(`/doctor/prescriptions?appointmentId=${id}`);
      }
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="Appointment Requests" description="Review and manage patient booking requests." />

      <div className="mb-6 flex flex-wrap gap-2">
        {['pending', 'accepted', 'completed', 'rejected'].map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? 'bg-[#5e17eb] text-white' : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300'}`}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${tab} appointments`} />
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <div key={appt._id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{appt.patientId?.name}</p>
                  <p className="text-sm text-slate-500">{appt.patientId?.email}</p>
                  <p className="mt-1 text-sm">{formatDateTime(appt.appointmentDate, appt.appointmentTime)}</p>
                  {appt.symptoms && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Symptoms: {appt.symptoms}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={appt.appointmentStatus} />
                  {appt.appointmentStatus === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 text-white" isLoading={loadingId === appt._id} onPress={() => runAction(appt._id, 'accept')}>Accept</Button>
                      <Button size="sm" className="bg-red-600 text-white" isLoading={loadingId === appt._id} onPress={() => runAction(appt._id, 'reject')}>Reject</Button>
                    </>
                  )}
                  {appt.appointmentStatus === 'accepted' && (
                    <Button size="sm" className="bg-[#5e17eb] text-white" isLoading={loadingId === appt._id} onPress={() => runAction(appt._id, 'complete')}>Mark completed</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
