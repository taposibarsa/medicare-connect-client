import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { User, Briefcase, DollarSign } from 'lucide-react';
import StarRating from './StarRating';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=5e17eb&color=fff&bold=true&name=Dr';

export default function DoctorCard({ doctor, className = '' }) {
  const id = doctor._id || doctor.id;
  const imageSrc = doctor.profileImage || `${DEFAULT_AVATAR}+${encodeURIComponent(doctor.doctorName || 'Doctor')}`;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 ${className}`}
    >
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={doctor.doctorName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={imageSrc.includes('ui-avatars.com')}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{doctor.doctorName}</h3>
        <p className="mt-1 text-sm font-medium text-[#5e17eb]">{doctor.specialization}</p>

        <div className="mt-3">
          <StarRating rating={doctor.avgRating} />
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p className="flex items-center gap-2">
            <Briefcase size={16} className="text-[#5e17eb]" />
            {doctor.experience} years experience
          </p>
          <p className="flex items-center gap-2">
            <DollarSign size={16} className="text-[#5e17eb]" />${doctor.consultationFee} consultation
          </p>
          {doctor.hospitalName && (
            <p className="flex items-center gap-2">
              <User size={16} className="text-[#5e17eb]" />
              {doctor.hospitalName}
            </p>
          )}
        </div>

        <div className="mt-auto pt-5">
          <Link href={`/doctors/${id}`}>
            <Button className="w-full bg-[#5e17eb] font-medium text-white hover:bg-[#4a12bc]">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
