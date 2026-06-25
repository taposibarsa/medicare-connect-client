'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/app/lib/auth-client';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import ImageUpload from '@/components/ImageUpload';
import usePageTitle from '@/hooks/usePageTitle';
import { getMe, updateMe } from '@/lib/api';

const GENDERS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function PatientProfile() {
  usePageTitle('My Profile | Patient Dashboard | MediCare Connect');

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await getMe();
        const user = result?.data;
        if (user) {
          setName(user.name || '');
          setPhoto(user.photo || '');
          setPhone(user.phone || '');
          setGender(user.gender || '');
          setEmail(user.email || '');
        }
      } catch (err) {
        const msg = err.message || 'Failed to load profile.';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await updateMe({
        name: name.trim(),
        photo,
        phone: phone.trim(),
        gender,
      });

      await authClient.updateUser({
        name: name.trim(),
        image: photo || undefined,
      });

      toast.success('Profile updated successfully.');
    } catch (err) {
      const msg = err.message || 'Failed to save profile.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Update your personal information and profile photo."
      />

      <div className="max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <ImageUpload value={photo} onChange={setPhoto} label="Profile photo" />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            >
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            isLoading={isSaving}
            className="bg-[#5e17eb] font-semibold text-white hover:bg-[#4a12bc]"
          >
            <Save size={18} className="mr-1" />
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
