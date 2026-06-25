'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import usePageTitle from '@/hooks/usePageTitle';
import { DAY_NAMES } from '@/lib/dayNames';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getMyDoctorProfile, updateDoctor } from '@/lib/api';

const DAY_OPTIONS = DAY_NAMES;

export default function DoctorSchedule() {
  usePageTitle('Schedule | Doctor Dashboard | MediCare Connect');

  const { data, isLoading, refetch } = useAsyncData(() => getMyDoctorProfile(), []);
  const doctor = data?.data;
  const [days, setDays] = useState([]);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (doctor) {
      setDays(doctor.availableDays || []);
      setSlots(doctor.availableSlots || []);
    }
  }, [doctor]);

  const toggleDay = (day) => {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    if (!slots.includes(newSlot.trim())) setSlots((prev) => [...prev, newSlot.trim()]);
    setNewSlot('');
  };

  const removeSlot = (slot) => setSlots((prev) => prev.filter((s) => s !== slot));

  const handleSave = async () => {
    if (!doctor?._id) return;
    setIsSaving(true);
    try {
      await updateDoctor(doctor._id, { availableDays: days, availableSlots: slots });
      toast.success('Schedule updated');
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
      <PageHeader title="Manage Schedule" description="Set your available days and time slots for patients." action={<Button className="bg-[#5e17eb] text-white" isLoading={isSaving} onPress={handleSave}>Save schedule</Button>} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="mb-4 font-semibold">Available days</h2>
          <div className="flex flex-wrap gap-2">
            {DAY_OPTIONS.map((day) => (
              <button key={day} type="button" onClick={() => toggleDay(day)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${days.includes(day) ? 'bg-[#5e17eb] text-white' : 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}>
                {day}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="mb-4 font-semibold">Time slots</h2>
          <div className="flex gap-2">
            <input type="time" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700 dark:bg-slate-800" />
            <Button className="bg-[#5e17eb] text-white" onPress={addSlot}>Add</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {slots.map((slot) => (
              <span key={slot} className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm text-[#5e17eb] dark:bg-[#5e17eb]/10">
                {slot}
                <button type="button" onClick={() => removeSlot(slot)} className="text-violet-400 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <h2 className="mb-4 font-semibold text-slate-800 dark:text-white">Monthly availability preview</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Highlighted dates show when patients can book based on your selected weekdays.
        </p>
        <AvailabilityCalendar availableDays={days} mode="display" />
      </section>
    </div>
  );
}
