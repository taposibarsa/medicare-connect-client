'use client';

import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import usePageTitle from '@/hooks/usePageTitle';
import { getPrescriptions } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/dashboardUtils';

export default function PatientPrescriptions() {
  usePageTitle('My Prescriptions | Patient Dashboard | MediCare Connect');

  const { data, isLoading } = useAsyncData(() => getPrescriptions(), []);
  const prescriptions = data?.data || [];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="My Prescriptions"
        description="View diagnoses and medications prescribed by your doctors."
      />

      {prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions yet"
          message="Prescriptions appear here after your doctor completes a consultation and issues one for your visit."
        />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx._id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5e17eb]">
                    Dr. {rx.doctorId?.doctorName}
                  </p>
                  <p className="text-xs text-slate-500">{rx.doctorId?.specialization}</p>
                </div>
                <p className="text-sm text-slate-500">
                  {formatDateTime(
                    rx.appointmentId?.appointmentDate,
                    rx.appointmentId?.appointmentTime
                  )}
                </p>
              </div>

              <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                {rx.diagnosis}
              </p>

              {rx.notes ? (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{rx.notes}</p>
              ) : null}

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Medications
                </p>
                <ul className="space-y-2">
                  {rx.medications?.map((med, i) => (
                    <li
                      key={i}
                      className="flex flex-col gap-0.5 text-sm text-slate-700 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-medium">{med.name}</span>
                      <span className="text-slate-500">
                        {med.dosage} · {med.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Issued {formatDate(rx.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
