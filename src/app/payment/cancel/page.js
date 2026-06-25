'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import usePageTitle from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { Button } from '@heroui/react';

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');

  usePageTitle('Payment Cancelled | MediCare Connect');

  useEffect(() => {
    toast.info('Payment cancelled — no charge was made.');
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <XCircle size={36} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">Payment cancelled</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        No charge was made. You can return to the doctor profile and try booking again when ready.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {doctorId ? (
          <Button className="bg-[#5e17eb] font-semibold text-white" onPress={() => router.push(`/doctors/${doctorId}`)}>
            Try again
          </Button>
        ) : null}
        <Button variant="bordered" onPress={() => router.push('/find-doctors')}>
          Browse doctors
        </Button>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
