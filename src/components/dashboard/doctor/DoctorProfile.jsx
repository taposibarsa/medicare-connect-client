'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import ImageUpload from '@/components/ImageUpload';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getMyDoctorProfile, updateDoctor } from '@/lib/api';

export default function DoctorProfile() {
  useEffect(() => { document.title = 'Doctor Profile | Doctor Dashboard | MediCare Connect'; }, []);

  const { data, isLoading, refetch } = useAsyncData(() => getMyDoctorProfile(), []);
  const doctor = data?.data;
  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (doctor) {
      setForm({
        doctorName: doctor.doctorName || '',
        specialization: doctor.specialization || '',
        qualifications: doctor.qualifications || '',
        experience: doctor.experience || 0,
        consultationFee: doctor.consultationFee || 0,
        hospitalName: doctor.hospitalName || '',
        profileImage: doctor.profileImage || '',
      });
    }
  }, [doctor]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!doctor?._id) return;
    setIsSaving(true);
    try {
      await updateDoctor(doctor._id, {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
      });
      toast.success('Profile updated');
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
      <PageHeader title="Professional Profile" description="Update your public doctor profile and fees." />

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <ImageUpload value={form.profileImage} onChange={(v) => set('profileImage', v)} label="Profile photo" />
        {['doctorName', 'specialization', 'qualifications', 'hospitalName'].map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input value={form[field] || ''} onChange={(e) => set(field, e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Experience (years)</label>
            <input type="number" min="0" value={form.experience} onChange={(e) => set('experience', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Consultation fee ($)</label>
            <input type="number" min="1" value={form.consultationFee} onChange={(e) => set('consultationFee', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>
        <Button type="submit" className="bg-[#5e17eb] text-white" isLoading={isSaving}>Save profile</Button>
      </form>
    </div>
  );
}
