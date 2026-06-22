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

export default function PatientPayments() {
  useEffect(() => { document.title = 'Payment History | MediCare Connect'; }, []);

  const { data, isLoading } = useAsyncData(() => getPayments(), []);
  const payments = data?.data || [];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="Payment History" description="View all your paid appointments and transactions." />
      <div className="mb-6 max-w-xs">
        <StatCard icon={CreditCard} label="Total spent" value={data?.total || 0} subtext="USD" accent="green" />
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payments yet" message="Payments appear after you book and pay for an appointment." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Doctor</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Amount</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-5 py-4">{formatDate(p.paymentDate)}</td>
                    <td className="px-5 py-4">{p.doctorId?.doctorName}</td>
                    <td className="px-5 py-4 font-medium">${p.amount}</td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">{p.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 p-4 md:hidden">
            {payments.map((p) => (
              <div key={p._id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="font-medium">{p.doctorId?.doctorName}</p>
                <p className="text-sm text-slate-500">{formatDate(p.paymentDate)}</p>
                <p className="mt-2 font-semibold text-[#5e17eb]">${p.amount}</p>
                <p className="mt-1 font-mono text-xs text-slate-400">{p.transactionId}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
