import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import { getDoctorById, getReviews } from '@/lib/api';
import StarRating from '@/components/StarRating';
import BookingForm from '@/components/BookingForm';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=5e17eb&color=fff&bold=true&size=256&name=Dr';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const { data } = await getDoctorById(id);
    return {
      title: `${data.doctorName} | MediCare Connect`,
      description: `Book an appointment with ${data.doctorName}, ${data.specialization} specialist.`,
    };
  } catch {
    return { title: 'Doctor Not Found | MediCare Connect' };
  }
}

export default async function DoctorDetailsPage({ params }) {
  const { id } = await params;

  let doctor;
  let reviews = [];

  try {
    const [doctorRes, reviewsRes] = await Promise.all([
      getDoctorById(id),
      getReviews({ doctorId: id }),
    ]);
    doctor = doctorRes.data;
    reviews = reviewsRes.data || [];
  } catch {
    notFound();
  }

  const imageSrc =
    doctor.profileImage ||
    `${DEFAULT_AVATAR}+${encodeURIComponent(doctor.doctorName || 'Doctor')}`;

  return (
    <div className="bg-slate-50 py-12 dark:bg-[#0f172a] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="relative h-64 md:h-auto md:min-h-[280px] bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={imageSrc}
                    alt={doctor.doctorName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={imageSrc.includes('ui-avatars.com')}
                  />
                </div>
                <div className="p-6 md:col-span-2">
                  <p className="text-sm font-medium text-[#5e17eb]">{doctor.specialization}</p>
                  <h1 className="mt-1 text-3xl font-bold text-slate-800 dark:text-white">
                    {doctor.doctorName}
                  </h1>
                  <div className="mt-3">
                    <StarRating rating={doctor.avgRating} size={18} />
                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                      ({doctor.reviewCount || 0} review{doctor.reviewCount !== 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Briefcase size={16} className="text-[#5e17eb]" />
                      {doctor.experience} years experience
                    </p>
                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <DollarSign size={16} className="text-[#5e17eb]" />$
                      {doctor.consultationFee} consultation fee
                    </p>
                    {doctor.hospitalName && (
                      <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Building2 size={16} className="text-[#5e17eb]" />
                        {doctor.hospitalName}
                      </p>
                    )}
                    {doctor.qualifications && (
                      <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <GraduationCap size={16} className="text-[#5e17eb]" />
                        {doctor.qualifications}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Availability</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={16} className="text-[#5e17eb]" />
                    Available Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(doctor.availableDays || []).map((day) => (
                      <span
                        key={day}
                        className="rounded-full bg-[#5e17eb]/10 px-3 py-1 text-xs font-medium text-[#5e17eb]"
                      >
                        {day}
                      </span>
                    ))}
                    {(!doctor.availableDays || doctor.availableDays.length === 0) && (
                      <span className="text-sm text-slate-500">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Clock size={16} className="text-[#5e17eb]" />
                    Time Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(doctor.availableSlots || []).map((slot) => (
                      <span
                        key={slot}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        {slot}
                      </span>
                    ))}
                    {(!doctor.availableSlots || doctor.availableSlots.length === 0) && (
                      <span className="text-sm text-slate-500">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Patient Reviews</h2>
              {reviews.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No reviews yet for this doctor.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <StarRating rating={review.rating} size={14} />
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {review.reviewText}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {review.patientId?.name || 'Patient'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm
                doctorId={id}
                consultationFee={doctor.consultationFee}
                availableDays={doctor.availableDays}
                availableSlots={doctor.availableSlots}
              />
              <Link
                href="/find-doctors"
                className="mt-4 block text-center text-sm font-medium text-[#5e17eb] hover:underline"
              >
                ← Back to all doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
