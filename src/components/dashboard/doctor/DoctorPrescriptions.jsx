'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getPrescriptions, getAppointmentById, createPrescription, updatePrescription } from '@/lib/api';
import { formatDateTime } from '@/lib/dashboardUtils';

const emptyMed = { name: '', dosage: '', duration: '' };

export default function DoctorPrescriptions() {
  useEffect(() => { document.title = 'Prescriptions | Doctor Dashboard | MediCare Connect'; }, []);
  const searchParams = useSearchParams();
  const prefillId = searchParams.get('appointmentId');

  const { data, isLoading, refetch } = useAsyncData(() => getPrescriptions(), []);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([{ ...emptyMed }]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!prefillId) return;
    getAppointmentById(prefillId).then((res) => {
      const appt = res?.data;
      if (appt) {
        setAppointmentId(appt._id);
        setPatientId(typeof appt.patientId === 'object' ? appt.patientId._id : appt.patientId);
        setShowForm(true);
      }
    }).catch(() => {});
  }, [prefillId]);

  const prescriptions = data?.data || [];

  const updateMed = (index, field, value) => {
    setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const addMed = () => setMedications((prev) => [...prev, { ...emptyMed }]);
  const removeMed = (index) => setMedications((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!patientId || !appointmentId || !diagnosis.trim()) {
      toast.error('Diagnosis and appointment are required.');
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
        await updatePrescription(editTarget._id, body);
        toast.success('Prescription updated');
      } else {
        await createPrescription(body);
        toast.success('Prescription created');
      }
      setShowForm(false);
      setEditTarget(null);
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
      <PageHeader title="Prescriptions" description="Create and manage patient prescriptions." action={<Button className="bg-[#5e17eb] text-white" onPress={() => { setShowForm(true); setEditTarget(null); }}>New prescription</Button>} />

      {prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions yet" message="Complete an appointment and create your first prescription." />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold">{rx.patientId?.name}</p>
                  <p className="text-sm text-slate-500">{formatDateTime(rx.appointmentId?.appointmentDate, rx.appointmentId?.appointmentTime)}</p>
                  <p className="mt-2 font-medium text-[#5e17eb]">{rx.diagnosis}</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {rx.medications?.map((m, i) => (
                      <li key={i}>{m.name} — {m.dosage}, {m.duration}</li>
                    ))}
                  </ul>
                </div>
                <Button size="sm" variant="bordered" onPress={() => { setEditTarget(rx); setPatientId(rx.patientId?._id); setAppointmentId(rx.appointmentId?._id); setDiagnosis(rx.diagnosis); setNotes(rx.notes || ''); setMedications(rx.medications?.length ? rx.medications : [{ ...emptyMed }]); setShowForm(true); }}>Edit</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold">{editTarget ? 'Edit prescription' : 'New prescription'}</h3>
            <div className="mt-4 space-y-3">
              <input placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <input placeholder="Appointment ID" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <input placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Medications</p>
                {medications.map((med, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input placeholder="Name" value={med.name} onChange={(e) => updateMed(i, 'name', e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
                    <input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMed(i, 'dosage', e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
                    <input placeholder="Duration" value={med.duration} onChange={(e) => updateMed(i, 'duration', e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button size="sm" variant="bordered" onPress={addMed}>Add med</Button>
                  {medications.length > 1 && <Button size="sm" variant="ghost" onPress={() => removeMed(medications.length - 1)}>Remove last</Button>}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onPress={() => setShowForm(false)}>Cancel</Button>
              <Button className="bg-[#5e17eb] text-white" isLoading={isSaving} onPress={handleSubmit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
