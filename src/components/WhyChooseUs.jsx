import { ShieldCheck, Clock, BadgeCheck, HeartHandshake, Smartphone, Users } from 'lucide-react';
import SectionHeading from './SectionHeading';

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Verified Doctors',
    description: 'Every doctor profile is reviewed and verified by our admin team before going live.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Health Records',
    description: 'Your medical data is protected with industry-standard security practices.',
  },
  {
    icon: Clock,
    title: '24/7 Online Booking',
    description: 'Search and book appointments anytime — no phone calls or waiting rooms needed.',
  },
  {
    icon: HeartHandshake,
    title: 'Patient-First Care',
    description: 'Transparent fees, real reviews, and easy access to your appointment history.',
  },
  {
    icon: Smartphone,
    title: 'Manage From Anywhere',
    description: 'Use any device to book, reschedule, and track your healthcare journey.',
  },
  {
    icon: Users,
    title: 'Trusted Community',
    description: 'Join thousands of patients and doctors on a modern healthcare platform.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-[#0f172a] sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Why Choose MediCare Connect"
          subtitle="Everything you need for a smoother, smarter healthcare experience."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5e17eb]/10 text-[#5e17eb]">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
