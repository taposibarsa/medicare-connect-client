'use client';

import { useEffect, useState } from 'react';
import { getReviews } from '@/lib/api';
import SectionHeading from './SectionHeading';
import StarRating from './StarRating';
import EmptyState from './EmptyState';

export default function SuccessStories() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews({ limit: 6 })
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-16 dark:bg-[#111827] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Patient Success Stories"
          subtitle="Real experiences from patients who found quality care through MediCare Connect."
        />

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <EmptyState
            title="No reviews yet"
            message="Be the first to share your experience after a completed appointment."
          />
        )}

        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <StarRating rating={review.rating} />
                <p className="mt-4 text-slate-700 dark:text-slate-300">&ldquo;{review.reviewText}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
                  {review.patientId?.name || 'Patient'}
                </p>
                {review.doctorId?.doctorName && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Consulted {review.doctorId.doctorName}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
