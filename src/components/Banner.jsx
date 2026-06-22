'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { ArrowRight, Activity } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="flex flex-col items-start space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#5e17eb]/10 px-4 py-2 text-sm font-medium text-[#5e17eb] dark:bg-[#5e17eb]/20">
              <Activity size={16} />
              <span>Modern Healthcare Platform</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
              Find & Book The <br className="hidden lg:block" />
              <span className="text-[#5e17eb]">Best Doctors</span> Near You
            </h1>

            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Experience seamless healthcare management with MediCare Connect. Book appointments,
              manage medical records, and consult top-rated specialists from the comfort of your home.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/find-doctors">
                <Button
                  size="lg"
                  className="bg-[#5e17eb] px-8 text-lg font-medium text-white shadow-xl shadow-[#5e17eb]/30 transition-transform hover:-translate-y-1"
                >
                  Book Appointment
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="absolute -inset-4 rounded-lg bg-[#5e17eb]/20 blur-md dark:bg-[#5e17eb]/15" />
            <div className="relative aspect-square w-full lg:aspect-[4/3] overflow-hidden rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Image
                src="/banner.jpg"
                alt="Healthcare Professionals"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
