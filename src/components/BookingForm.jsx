'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useSession } from '@/app/lib/auth-client';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BookingForm({ doctorId, availableDays = [], availableSlots = [] }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [dayError, setDayError] = useState('');

  const isLoggedIn = Boolean(session?.user);

  const validateDay = (dateStr) => {
    if (!dateStr || availableDays.length === 0) {
      setDayError('');
      return true;
    }

    const dayName = DAY_NAMES[new Date(dateStr).getUTCDay()];
    if (!availableDays.includes(dayName)) {
      setDayError(`Doctor is not available on ${dayName}. Available: ${availableDays.join(', ')}`);
      return false;
    }

    setDayError('');
    return true;
  };

  const handleBookClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/doctors/${doctorId}`)}`);
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleBookClick();
      return;
    }
    validateDay(appointmentDate);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Book Appointment</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Select your preferred date and time. Online payment will be required to confirm your booking.
      </p>

      {!isLoggedIn && !isPending && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          Please sign in to book an appointment with this doctor.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Calendar size={16} />
            Appointment Date
          </label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => {
              setAppointmentDate(e.target.value);
              validateDay(e.target.value);
            }}
            min={new Date().toISOString().split('T')[0]}
            disabled={!isLoggedIn}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
            disabled={!isLoggedIn || availableSlots.length === 0}
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
            disabled={!isLoggedIn}
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
          <>
            <Button
              type="submit"
              isDisabled
              className="w-full bg-[#5e17eb]/50 py-6 text-base font-semibold text-white"
            >
              Book Appointment
            </Button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Online payment required — available in a future update.
            </p>
          </>
        )}
      </form>
    </div>
  );
}
