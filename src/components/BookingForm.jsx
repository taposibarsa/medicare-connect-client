'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { useSession } from '@/app/lib/auth-client';
import { getDayNameFromDate } from '@/lib/dayNames';
import { createCheckoutSession } from '@/lib/api';

export default function BookingForm({
  doctorId,
  consultationFee = 0,
  availableDays = [],
  availableSlots = [],
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [dayError, setDayError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = Boolean(session?.user);
  const isPatient = session?.user?.role === 'patient';
  const canBook = isLoggedIn && isPatient;
  const todayKey = new Date().toISOString().split('T')[0];

  const validateDay = (dateStr) => {
    if (!dateStr || availableDays.length === 0) {
      setDayError('');
      return true;
    }

    const dayName = getDayNameFromDate(dateStr);
    if (!availableDays.includes(dayName)) {
      setDayError(`Doctor is not available on ${dayName}. Available: ${availableDays.join(', ')}`);
      return false;
    }

    setDayError('');
    return true;
  };

  const handleDateSelect = (dateStr) => {
    setAppointmentDate(dateStr);
    validateDay(dateStr);
  };

  const handleBookClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/doctors/${doctorId}`)}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      handleBookClick();
      return;
    }

    if (!isPatient) {
      toast.error('Only patient accounts can book appointments.');
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      toast.error('Please select a date and time slot.');
      return;
    }

    if (!validateDay(appointmentDate)) {
      toast.error(dayError || 'Selected date is not available.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await createCheckoutSession({
        doctorId,
        appointmentDate,
        appointmentTime,
        symptoms: symptoms.trim(),
      });

      if (result?.data?.url) {
        window.location.href = result.data.url;
        return;
      }

      toast.error('Could not start checkout. Please try again.');
    } catch (err) {
      toast.error(err.message || 'Payment checkout failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Book Appointment</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Select your preferred date and time. Payment is required to confirm your booking.
      </p>

      {consultationFee > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-3 text-sm font-medium text-[#5e17eb] dark:bg-[#5e17eb]/10">
          <DollarSign size={18} />
          Consultation fee: ${consultationFee}
        </div>
      )}

      {!isLoggedIn && !isPending && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          Please sign in to book an appointment with this doctor.
        </div>
      )}

      {isLoggedIn && !isPatient && !isPending && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          Only patient accounts can book appointments. Please use a patient account.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Calendar size={16} />
            Appointment Date
          </label>
          <AvailabilityCalendar
            availableDays={availableDays}
            selectedDate={appointmentDate}
            onSelectDate={canBook ? handleDateSelect : undefined}
            mode="pick"
            minDate={todayKey}
          />
          {dayError && <p className="mt-1 text-xs text-red-500">{dayError}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Clock size={16} />
            Time Slot
          </label>
          <select
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            disabled={!canBook || availableSlots.length === 0}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <FileText size={16} />
            Symptoms / Reason for Visit
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            disabled={!canBook}
            placeholder="Describe your symptoms or reason for consultation..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {!isLoggedIn ? (
          <Button
            type="button"
            onPress={handleBookClick}
            className="w-full bg-[#5e17eb] py-6 text-base font-semibold text-white hover:bg-[#4a12bc]"
          >
            Sign In to Book
          </Button>
        ) : (
          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={!canBook}
            className="w-full bg-[#5e17eb] py-6 text-base font-semibold text-white hover:bg-[#4a12bc] disabled:opacity-50"
          >
            Book & Pay
          </Button>
        )}
      </form>
    </div>
  );
}
