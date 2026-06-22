'use client';

import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { Users, Stethoscope, Calendar } from 'lucide-react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAdminAnalytics } from '@/lib/api';

const PIE_COLORS = ['#5e17eb', '#22c55e', '#f59e0b', '#ef4444', '#64748b', '#3b82f6'];

export default function AdminAnalytics() {
  useEffect(() => { document.title = 'Analytics | Admin Dashboard | MediCare Connect'; }, []);

  const { data, isLoading } = useAsyncData(() => getAdminAnalytics(), []);
  const stats = data?.data || {};
  const barData = (stats.doctorPerformance || []).slice(0, 8);
  const pieData = (stats.appointmentStatusBreakdown || []).map((item) => ({
    name: item.status,
    value: item.count,
  }));

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader title="Analytics" description="Platform performance and appointment insights." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Total patients" value={stats.totalPatients || 0} accent="violet" />
        <StatCard icon={Stethoscope} label="Verified doctors" value={stats.totalDoctors || 0} accent="blue" />
        <StatCard icon={Calendar} label="Total appointments" value={stats.totalAppointments || 0} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="mb-4 font-semibold text-slate-800 dark:text-white">Doctor performance (avg rating)</h2>
          {barData.length === 0 ? (
            <p className="text-sm text-slate-500">No review data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="doctorName" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="avgRating" fill="#5e17eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="mb-4 font-semibold text-slate-800 dark:text-white">Appointment status breakdown</h2>
          {pieData.length === 0 ? (
            <p className="text-sm text-slate-500">No appointment data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </div>
  );
}
