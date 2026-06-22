import { Suspense } from 'react';
import DoctorPrescriptions from '@/components/dashboard/doctor/DoctorPrescriptions';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function DoctorPrescriptionsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DoctorPrescriptions />
    </Suspense>
  );
}
