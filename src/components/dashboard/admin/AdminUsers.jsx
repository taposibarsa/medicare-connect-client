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
import { getUsers, suspendUser, deleteUser } from '@/lib/api';
import { formatDate } from '@/lib/dashboardUtils';

export default function AdminUsers() {
  useEffect(() => { document.title = 'Users | Admin Dashboard | MediCare Connect'; }, []);

  const { data, isLoading, refetch } = useAsyncData(() => getUsers(), []);
  const [target, setTarget] = useState(null);
  const [action, setAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const users = data?.data || [];

  const handleConfirm = async () => {
    if (!target) return;
    setIsSaving(true);
    try {
      if (action === 'suspend') {
        await suspendUser(target.id);
        toast.success('User suspended');
      } else {
        await deleteUser(target.id);
        toast.success('User deleted');
      }
      setTarget(null);
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
      <PageHeader title="User Management" description="View, suspend, or remove platform users." />

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-4 font-medium">{user.name}</td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4 capitalize">{user.role}</td>
                  <td className="px-5 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-5 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {user.status !== 'suspended' && (
                        <Button size="sm" variant="bordered" onPress={() => { setTarget(user); setAction('suspend'); }}>Suspend</Button>
                      )}
                      <Button size="sm" className="bg-red-600 text-white" onPress={() => { setTarget(user); setAction('delete'); }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(target)}
        onClose={() => setTarget(null)}
        onConfirm={handleConfirm}
        title={action === 'suspend' ? 'Suspend user?' : 'Delete user?'}
        message={action === 'suspend' ? 'The user will not be able to log in.' : 'This permanently removes the user and related data.'}
        confirmLabel={action === 'suspend' ? 'Suspend' : 'Delete'}
        isLoading={isSaving}
      />
    </div>
  );
}
