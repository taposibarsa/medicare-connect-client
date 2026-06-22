'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAppointments, rescheduleAppointment, cancelAppointment } from '@/lib/api';
import { formatDateTime, isUpcoming } from '@/lib/dashboardUtils';

export default function PatientAppointments() {
  useEffect(() => { document.title = 'My Appointments | MediCare Connect'; }, []);

  const { data, isLoading, refetch } = useAsyncData(() => getAppointments(), []);
  const [tab, setTab] = useState('upcoming');
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const appointments = data?.data || [];
  const filtered = appointments.filter((a) => {
    if (tab === 'upcoming') return isUpcoming(a.appointmentDate) && ['pending', 'accepted'].includes(a.appointmentStatus);
    if (tab === 'past') return ['completed', 'rejected'].includes(a.appointmentStatus) || !isUpcoming(a.appointmentDate);
    return a.appointmentStatus === 'cancelled';
  });

  const handleReschedule = async () => {
    if (!rescheduleTarget || !newDate || !newTime) return;
    setIsSaving(true);
    try {
      await rescheduleAppointment(rescheduleTarget._id, { appointmentDate: newDate, appointmentTime: newTime });
      toast.success('Appointment rescheduled');
      setRescheduleTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setIsSaving(true);
    try {
      await cancelAppointment(cancelTarget._id);
      toast.success('Appointment cancelled');
      setCancelTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="My Appointments" description="View, reschedule, or cancel your bookings." />

      <div className="mb-6 flex flex-wrap gap-2">
        {['upcoming', 'past', 'cancelled'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-[#5e17eb] text-white' : 'bg-white text-slate-600 border border-slate-200 dark:bg-[#111827] dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No appointments" message="Your appointments will appear here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <div key={appt._id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{appt.doctorId?.doctorName}</p>
                  <p className="text-sm text-[#5e17eb]">{appt.doctorId?.specialization}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDateTime(appt.appointmentDate, appt.appointmentTime)}</p>
                  {appt.symptoms && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Symptoms: {appt.symptoms}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={appt.appointmentStatus} />
                  {['pending', 'accepted'].includes(appt.appointmentStatus) && (
                    <>
                      <Button size="sm" variant="bordered" onPress={() => { setRescheduleTarget(appt); setNewDate(appt.appointmentDate?.slice(0, 10) || ''); setNewTime(appt.appointmentTime || ''); }}>
                        Reschedule
                      </Button>
                      <Button size="sm" className="bg-red-600 text-white" onPress={() => setCancelTarget(appt)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Reschedule appointment</h3>
            <div className="mt-4 space-y-3">
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onPress={() => setRescheduleTarget(null)}>Close</Button>
              <Button className="bg-[#5e17eb] text-white" isLoading={isSaving} onPress={handleReschedule}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel appointment?"
        message="This action cannot be undone."
        confirmLabel="Cancel appointment"
        isLoading={isSaving}
      />
    </div>
  );
}
