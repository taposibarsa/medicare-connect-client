'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Loader2, AlertCircle, Stethoscope, Clock, DollarSign } from 'lucide-react';
import { Button, Spinner } from '@heroui/react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import usePageTitle from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { confirmCheckoutSession } from '@/lib/api';
import { formatDateTime } from '@/lib/dashboardUtils';

function BookingSummary({ appointment, payment }) {
  const doctor = appointment?.doctorId;

  return (
    <div className="mt-8 w-full rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Booking summary
      </h2>

      <div className="mt-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[#5e17eb] dark:bg-violet-900/30">
            <Stethoscope size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">
              Dr. {doctor?.doctorName || 'Doctor'}
            </p>
            <p className="text-sm text-[#5e17eb]">{doctor?.specialization || '—'}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Calendar size={16} className="shrink-0 text-slate-400" />
            <span>{formatDateTime(appointment?.appointmentDate, appointment?.appointmentTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <DollarSign size={16} className="shrink-0 text-slate-400" />
            <span>${Number(payment?.amount || doctor?.consultationFee || 0).toFixed(2)} paid</span>
          </div>
        </div>

        {appointment?.symptoms ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Symptoms: </span>
            {appointment.symptoms}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <StatusBadge status={appointment?.appointmentStatus} />
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <Clock size={12} />
            {appointment?.paymentStatus || 'paid'}
          </span>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState(sessionId ? 'confirming' : 'missing');
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  usePageTitle('Payment Successful | MediCare Connect');

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await confirmCheckoutSession(sessionId);
        if (!cancelled) {
          setBooking(result?.data || null);
          setStatus('confirmed');
          toast.success('Payment successful! Your appointment has been booked.');
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.message || 'Could not confirm your booking';
          setStatus('error');
          setError(msg);
          toast.error(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === 'confirming') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <Spinner size="lg" color="secondary" />
        <p className="mt-6 text-slate-600 dark:text-slate-400">Confirming your appointment...</p>
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertCircle size={36} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">Payment received</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          We could not verify this checkout session. If you completed payment, check your patient
          dashboard — your appointment may still appear shortly.
        </p>
        <Button
          className="mt-8 bg-[#5e17eb] font-semibold text-white"
          onPress={() => router.push('/patient/appointments')}
        >
          View appointments
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <Loader2 size={36} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">Almost there</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{error}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
          Your payment may have succeeded. Refresh your appointments page in a moment.
        </p>
        <Button
          className="mt-8 bg-[#5e17eb] font-semibold text-white"
          onPress={() => router.push('/patient/appointments')}
        >
          View appointments
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2 size={36} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">Payment successful</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Your appointment request has been submitted and is pending doctor approval.
      </p>

      {booking?.appointment ? (
        <BookingSummary appointment={booking.appointment} payment={booking.payment} />
      ) : null}

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          className="bg-[#5e17eb] font-semibold text-white"
          onPress={() => router.push('/patient/appointments')}
        >
          <Calendar size={18} className="mr-1" />
          View appointments
        </Button>
        <Button variant="bordered" onPress={() => router.push('/find-doctors')}>
          Find more doctors
        </Button>
      </div>

      <Link
        href="/patient"
        className="mt-4 text-sm font-medium text-[#5e17eb] hover:underline"
      >
        Go to patient dashboard
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
