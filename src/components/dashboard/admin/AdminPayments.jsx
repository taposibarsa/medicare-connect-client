'use client';

import { useEffect } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import EmptyState from '@/components/EmptyState';
import StatCard from '@/components/dashboard/StatCard';
import { CreditCard } from 'lucide-react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getPayments } from '@/lib/api';
import { formatDate } from '@/lib/dashboardUtils';

export default function AdminPayments() {
  useEffect(() => { document.title = 'Payments | Admin Dashboard | MediCare Connect'; }, []);

  const { data, isLoading } = useAsyncData(() => getPayments(), []);
  const payments = data?.data || [];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="Payment Management" description="View all platform payment records." />
      <div className="mb-6 max-w-xs">
        <StatCard icon={CreditCard} label="Total revenue" value={data?.total || 0} subtext="USD" accent="green" />
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payments recorded" message="Payments appear after patients complete Stripe checkout." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-4">{formatDate(p.paymentDate)}</td>
                  <td className="px-5 py-4">{p.patientId?.name}</td>
                  <td className="px-5 py-4">{p.doctorId?.doctorName}</td>
                  <td className="px-5 py-4 font-medium">${p.amount}</td>
                  <td className="px-5 py-4 font-mono text-xs">{p.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
