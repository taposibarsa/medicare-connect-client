'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@heroui/react';
import { getDoctors } from '@/lib/api';
import DoctorCard from '@/components/DoctorCard';
import EmptyState from '@/components/EmptyState';
import SectionHeading from '@/components/SectionHeading';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
  { value: 'experience_asc', label: 'Experience: Low to High' },
  { value: 'experience_desc', label: 'Experience: High to Low' },
  { value: 'rating_desc', label: 'Highest Rating' },
];

export default function FindDoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || searchParams.get('specialization') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="bg-slate-50 py-12 dark:bg-[#0f172a] min-h-screen">
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

        {!loading && !error && (
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            {total} doctor{total !== 1 ? 's' : ''} found
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        )}

        {!loading && error && <EmptyState title="Unable to load doctors" message={error} />}

        {!loading && !error && doctors.length === 0 && (
          <EmptyState
            title="No doctors found"
            message="Try adjusting your search or browse all specializations from the home page."
          />
        )}

        {!loading && !error && doctors.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>

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
