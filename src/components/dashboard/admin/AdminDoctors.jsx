'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAdminDoctors, verifyDoctor, rejectDoctor, revokeDoctor } from '@/lib/api';

export default function AdminDoctors() {
  useEffect(() => { document.title = 'Doctors | Admin Dashboard | MediCare Connect'; }, []);

  const [tab, setTab] = useState('pending');
  const [confirm, setConfirm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { data, isLoading, refetch } = useAsyncData(() => getAdminDoctors(tab), [tab]);

  const doctors = data?.data || [];

  const runAction = async () => {
    if (!confirm) return;
    setIsSaving(true);
    try {
      if (confirm.action === 'verify') {
        await verifyDoctor(confirm.id);
        toast.success('Doctor verified successfully');
      } else if (confirm.action === 'reject') {
        await rejectDoctor(confirm.id);
        toast.success('Doctor application rejected');
      } else {
        await revokeDoctor(confirm.id);
        toast.success('Doctor verification revoked');
      }
      setConfirm(null);
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
      <PageHeader title="Doctor Verification" description="Review and manage doctor profiles." />

      <div className="mb-6 flex flex-wrap gap-2">
        {['pending', 'verified', 'rejected'].map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? 'bg-[#5e17eb] text-white' : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111827]'}`}>{t}</button>
        ))}
      </div>

      {doctors.length === 0 ? (
        <EmptyState title={tab === 'pending' ? 'No pending doctors' : `No ${tab} doctors`} message={tab === 'pending' ? 'All doctor applications have been reviewed.' : undefined} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((doc) => (
            <div key={doc._id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex gap-4">
                <Image src={doc.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.doctorName)}`} alt={doc.doctorName} width={56} height={56} className="rounded-full object-cover" unoptimized />
                <div className="flex-1">
                  <p className="font-semibold">{doc.doctorName}</p>
                  <p className="text-sm text-[#5e17eb]">{doc.specialization}</p>
                  <p className="text-sm text-slate-500">{doc.hospitalName}</p>
                  <p className="mt-1 text-sm">${doc.consultationFee} · {doc.experience} yrs</p>
                  <StatusBadge status={doc.verificationStatus} className="mt-2" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tab === 'pending' && (
                  <>
                    <Button size="sm" className="bg-green-600 text-white" onPress={() => setConfirm({ id: doc._id, action: 'verify' })}>Verify</Button>
                    <Button size="sm" className="bg-red-600 text-white" onPress={() => setConfirm({ id: doc._id, action: 'reject' })}>Reject</Button>
                  </>
                )}
                {tab === 'verified' && (
                  <Button size="sm" variant="bordered" onPress={() => setConfirm({ id: doc._id, action: 'revoke' })}>Revoke</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={Boolean(confirm)} onClose={() => setConfirm(null)} onConfirm={runAction} title="Confirm action" message="Are you sure you want to update this doctor's verification status?" confirmLabel="Confirm" isLoading={isSaving} />
    </div>
  );
}
