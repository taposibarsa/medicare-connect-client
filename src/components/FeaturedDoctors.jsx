'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedDoctors } from '@/lib/api';
import DoctorCard from './DoctorCard';
import SectionHeading from './SectionHeading';
import EmptyState from './EmptyState';

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getFeaturedDoctors(6)
      .then((res) => setDoctors(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-16 dark:bg-[#111827] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Featured Doctors"
          subtitle="Top-rated verified specialists ready to help you with your healthcare needs."
        />

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        )}

        {!loading && error && <EmptyState title="Unable to load doctors" message={error} />}

        {!loading && !error && doctors.length === 0 && (
          <EmptyState title="No featured doctors yet" message="Check back soon for verified specialists." />
        )}

        {!loading && !error && doctors.length > 0 && (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {doctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
              >
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
