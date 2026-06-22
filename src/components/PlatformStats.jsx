'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, MessageSquare } from 'lucide-react';
import { getStats } from '@/lib/api';
import AnimatedCounter from './AnimatedCounter';
import SectionHeading from './SectionHeading';

const statItems = [
  { key: 'totalDoctors', label: 'Verified Doctors', icon: Stethoscope },
  { key: 'totalPatients', label: 'Registered Patients', icon: Users },
  { key: 'totalAppointments', label: 'Appointments Booked', icon: Calendar },
  { key: 'totalReviews', label: 'Patient Reviews', icon: MessageSquare },
];

export default function PlatformStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, totalReviews: 0 }));
  }, []);

  return (
    <section className="bg-[#5e17eb] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Platform at a Glance"
          subtitle="Trusted by patients and doctors across our growing healthcare network."
          light
        />

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {statItems.map(({ key, label, icon: Icon }) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm"
            >
              <Icon size={28} className="mb-4 text-violet-200" />
              <p className="text-3xl font-bold">
                {stats ? <AnimatedCounter value={stats[key]} /> : '—'}
              </p>
              <p className="mt-2 text-sm text-violet-100">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
