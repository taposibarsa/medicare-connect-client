'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { Save, User } from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import AuthLoading, { useAuthGuard } from '@/components/RoleGuard';
import ImageUpload from '@/components/ImageUpload';
import { getMe, updateMe } from '@/lib/api';

const GENDERS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function ProfilePage() {
  const { session, isPending } = useAuthGuard();
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'My Profile | MediCare Connect';
  }, []);

  useEffect(() => {
    if (isPending || !session?.user) return;

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const result = await getMe();
        const user = result?.data;

        if (user) {
          setName(user.name || '');
          setPhoto(user.photo || session.user.image || '');
          setPhone(user.phone || '');
          setGender(user.gender || '');
          setEmail(user.email || '');
          setRole(user.role || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session, isPending]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !session?.user || isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <AuthLoading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#111827]">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5e17eb]/10 text-[#5e17eb]">
            <User size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your personal information
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400">
            {success}
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
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
              Role
            </label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 capitalize text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400"
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
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
