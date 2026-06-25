'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@heroui/react';
import { getDoctors } from '@/lib/api';
import DoctorCard from '@/components/DoctorCard';
import EmptyState from '@/components/EmptyState';
import SectionHeading from '@/components/SectionHeading';
import StarRating from '@/components/StarRating';
import DoctorGridSkeleton from '@/components/skeletons/DoctorGridSkeleton';

const VIEW_STORAGE_KEY = 'medicare-find-doctors-view';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
  { value: 'experience_asc', label: 'Experience: Low to High' },
  { value: 'experience_desc', label: 'Experience: High to Low' },
  { value: 'rating_desc', label: 'Highest Rating' },
];

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=5e17eb&color=fff&bold=true&name=Dr';

function DoctorsTable({ doctors }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 font-semibold">Doctor</th>
            <th className="px-4 py-3 font-semibold">Specialization</th>
            <th className="px-4 py-3 font-semibold">Experience</th>
            <th className="px-4 py-3 font-semibold">Fee</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => {
            const id = doctor._id || doctor.id;
            const imageSrc =
              doctor.profileImage ||
              `${DEFAULT_AVATAR}+${encodeURIComponent(doctor.doctorName || 'Doctor')}`;

            return (
              <tr
                key={id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={imageSrc}
                      alt={doctor.doctorName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      unoptimized={imageSrc.includes('ui-avatars.com')}
                    />
                    <span className="font-medium text-slate-800 dark:text-white">
                      {doctor.doctorName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#5e17eb]">{doctor.specialization}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {doctor.experience} yrs
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  ${doctor.consultationFee}
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={doctor.avgRating} size={14} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/doctors/${id}`}
                    className="font-medium text-[#5e17eb] hover:underline"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function FindDoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || searchParams.get('specialization') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [viewMode, setViewMode] = useState('card');
  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'card' || saved === 'table') {
      setViewMode(saved);
    }
  }, []);

  const updateUrl = useCallback(
    (nextSearch, nextSort, nextPage) => {
      const params = new URLSearchParams();
      if (nextSearch) params.set('search', nextSearch);
      if (nextSort) params.set('sort', nextSort);
      if (nextPage > 1) params.set('page', String(nextPage));
      const qs = params.toString();
      router.replace(qs ? `/find-doctors?${qs}` : '/find-doctors', { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      getDoctors({ search: search || undefined, sort: sort || undefined, page, limit: 9 })
        .then((res) => {
          setDoctors(res.data || []);
          setTotalPages(res.totalPages || 1);
          setTotal(res.total || 0);
        })
        .catch((err) => {
          setError(err.message);
          setDoctors([]);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [search, sort, page]);

  useEffect(() => {
    updateUrl(search, sort, page);
  }, [search, sort, page, updateUrl]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-[#0f172a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Find Doctors"
          subtitle="Search verified specialists, compare fees and experience, and book with confidence."
          align="left"
        />

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or specialization..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-800 outline-none focus:border-[#5e17eb] focus:ring-2 focus:ring-[#5e17eb]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => handleViewChange('card')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  viewMode === 'card'
                    ? 'bg-[#5e17eb] text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                aria-label="Card view"
              >
                <LayoutGrid size={16} />
                Cards
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('table')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-[#5e17eb] text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                aria-label="Table view"
              >
                <List size={16} />
                Table
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#5e17eb] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value || 'default'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!loading && !error && (
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            {total} doctor{total !== 1 ? 's' : ''} found
          </p>
        )}

        {loading && <DoctorGridSkeleton />}

        {!loading && error && <EmptyState title="Unable to load doctors" message={error} />}

        {!loading && !error && doctors.length === 0 && (
          <EmptyState
            title="No doctors found"
            message="Try adjusting your search or browse all specializations from the home page."
          />
        )}

        {!loading && !error && doctors.length > 0 && (
          <>
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <DoctorsTable doctors={doctors} />
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  onPress={() => goToPage(page - 1)}
                  isDisabled={page <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </Button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (totalPages > 7 && Math.abs(pageNum - page) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span key={pageNum} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      className={
                        pageNum === page
                          ? 'bg-[#5e17eb] text-white'
                          : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }
                      onPress={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  isIconOnly
                  variant="flat"
                  onPress={() => goToPage(page + 1)}
                  isDisabled={page >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
