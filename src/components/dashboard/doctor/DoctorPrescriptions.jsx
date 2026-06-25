'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import usePageTitle from '@/hooks/usePageTitle';
import {
  getPrescriptions,
  getAppointments,
  getAppointmentById,
  createPrescription,
  updatePrescription,
} from '@/lib/api';
import { formatDateTime } from '@/lib/dashboardUtils';

const emptyMed = { name: '', dosage: '', duration: '' };

function getPatientId(appt) {
  if (!appt?.patientId) return '';
  return typeof appt.patientId === 'object' ? appt.patientId._id : appt.patientId;
}

function getAppointmentLabel(appt) {
  const name = appt.patientId?.name || 'Patient';
  return `${name} — ${formatDateTime(appt.appointmentDate, appt.appointmentTime)}`;
}

function DoctorPrescriptionsContent() {
  usePageTitle('Prescriptions | Doctor Dashboard | MediCare Connect');
  const searchParams = useSearchParams();
  const prefillId = searchParams.get('appointmentId');

  const { data, isLoading, refetch } = useAsyncData(() => getPrescriptions(), []);
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAsyncData(
    () => getAppointments(),
    []
  );

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([{ ...emptyMed }]);
  const [isSaving, setIsSaving] = useState(false);

  const prescriptions = data?.data || [];
  const prescribedAppointmentIds = useMemo(
    () => new Set(prescriptions.map((rx) => rx.appointmentId?._id || rx.appointmentId)),
    [prescriptions]
  );

  const completedAppointments = useMemo(() => {
    const all = appointmentsData?.data || [];
    return all.filter((appt) => appt.appointmentStatus === 'completed');
  }, [appointmentsData]);

  const availableAppointments = useMemo(() => {
    if (editTarget) return completedAppointments;
    return completedAppointments.filter((appt) => !prescribedAppointmentIds.has(appt._id));
  }, [completedAppointments, prescribedAppointmentIds, editTarget]);

  const selectedAppointment = useMemo(
    () => completedAppointments.find((appt) => appt._id === appointmentId),
    [completedAppointments, appointmentId]
  );

  const resetForm = () => {
    setPatientId('');
    setAppointmentId('');
    setDiagnosis('');
    setNotes('');
    setMedications([{ ...emptyMed }]);
    setEditTarget(null);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleAppointmentSelect = (id) => {
    setAppointmentId(id);
    const appt = completedAppointments.find((a) => a._id === id);
    if (appt) {
      setPatientId(getPatientId(appt));
    }
  };

  useEffect(() => {
    if (!prefillId) return;
    getAppointmentById(prefillId)
      .then((res) => {
        const appt = res?.data;
        if (appt) {
          setAppointmentId(appt._id);
          setPatientId(getPatientId(appt));
          setShowForm(true);
        }
      })
      .catch(() => {});
  }, [prefillId]);

  const updateMed = (index, field, value) => {
    setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const addMed = () => setMedications((prev) => [...prev, { ...emptyMed }]);
  const removeMed = (index) => setMedications((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!patientId || !appointmentId || !diagnosis.trim()) {
      toast.error('Please select a completed appointment and enter a diagnosis.');
      return;
    }
    const validMeds = medications.filter((m) => m.name && m.dosage && m.duration);
    if (validMeds.length === 0) {
      toast.error('Add at least one medication.');
      return;
    }
    setIsSaving(true);
    try {
      const body = { patientId, appointmentId, diagnosis, medications: validMeds, notes };
      if (editTarget) {
        await updatePrescription(editTarget._id, {
          diagnosis,
          medications: validMeds,
          notes,
        });
        toast.success('Prescription updated');
      } else {
        await createPrescription(body);
        toast.success('Prescription created');
      }
      setShowForm(false);
      resetForm();
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || appointmentsLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="Create prescriptions for completed consultations."
        action={
          <Button className="bg-[#5e17eb] text-white" onPress={openNewForm}>
            New prescription
          </Button>
        }
      />

      {prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions yet"
          message="Mark an appointment as completed, then create a prescription for that visit."
        />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx._id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {rx.patientId?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDateTime(
                      rx.appointmentId?.appointmentDate,
                      rx.appointmentId?.appointmentTime
                    )}
                  </p>
                  <p className="mt-2 font-medium text-[#5e17eb]">{rx.diagnosis}</p>
                  {rx.notes ? (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{rx.notes}</p>
                  ) : null}
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {rx.medications?.map((m, i) => (
                      <li key={i}>
                        {m.name} — {m.dosage}, {m.duration}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => {
                    setEditTarget(rx);
                    setPatientId(rx.patientId?._id);
                    setAppointmentId(rx.appointmentId?._id);
                    setDiagnosis(rx.diagnosis);
                    setNotes(rx.notes || '');
                    setMedications(rx.medications?.length ? rx.medications : [{ ...emptyMed }]);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              {editTarget ? 'Edit prescription' : 'New prescription'}
            </h3>

            <div className="mt-4 space-y-3">
              {editTarget ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Patient & visit
                  </p>
                  <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                    {editTarget.patientId?.name || selectedAppointment?.patientId?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDateTime(
                      editTarget.appointmentId?.appointmentDate ||
                        selectedAppointment?.appointmentDate,
                      editTarget.appointmentId?.appointmentTime ||
                        selectedAppointment?.appointmentTime
                    )}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Completed appointment
                  </label>
                  <select
                    value={appointmentId}
                    onChange={(e) => handleAppointmentSelect(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Select patient and visit...</option>
                    {availableAppointments.map((appt) => (
                      <option key={appt._id} value={appt._id}>
                        {getAppointmentLabel(appt)}
                      </option>
                    ))}
                  </select>
                  {availableAppointments.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      No completed appointments without a prescription. Mark a visit as completed
                      first.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Diagnosis
                </label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Seasonal allergies"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Follow-up advice, lifestyle tips..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Medications</p>
                {medications.map((med, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input
                      placeholder="Name"
                      value={med.name}
                      onChange={(e) => updateMed(i, 'name', e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => updateMed(i, 'dosage', e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => updateMed(i, 'duration', e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button size="sm" variant="bordered" onPress={addMed}>
                    Add medication
                  </Button>
                  {medications.length > 1 && (
                    <Button size="sm" variant="ghost" onPress={() => removeMed(medications.length - 1)}>
                      Remove last
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                onPress={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#5e17eb] text-white"
                isLoading={isSaving}
                onPress={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorPrescriptions() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DoctorPrescriptionsContent />
    </Suspense>
  );
}
