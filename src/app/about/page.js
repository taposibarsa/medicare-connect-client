import { Search, Calendar, Stethoscope, Heart, Users, Target } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

export const metadata = {
  title: 'About Us | MediCare Connect',
  description: 'Learn about MediCare Connect — our mission to make healthcare accessible, transparent, and patient-centered.',
};

const steps = [
  {
    icon: Search,
    title: 'Search',
    description: 'Browse verified doctors by specialization, experience, fee, and patient ratings.',
  },
  {
    icon: Calendar,
    title: 'Book',
    description: 'Choose an available slot, describe your symptoms, and secure your appointment online.',
  },
  {
    icon: Stethoscope,
    title: 'Consult',
    description: 'Meet your doctor, receive care, and access prescriptions and follow-up in your dashboard.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Patient-Centered',
    description: 'Every feature is designed to put patients first — clarity, convenience, and trust.',
  },
  {
    icon: Target,
    title: 'Quality Care',
    description: 'We partner only with verified professionals committed to excellent medical practice.',
  },
  {
    icon: Users,
    title: 'Community Trust',
    description: 'Real reviews and transparent profiles help you make informed healthcare decisions.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 dark:bg-[#0f172a] min-h-screen">
      <section className="bg-gradient-to-br from-[#5e17eb] to-[#4c1d95] py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold sm:text-5xl">About MediCare Connect</h1>
          <p className="mt-6 text-lg text-violet-100 leading-relaxed">
            We are on a mission to bridge the gap between patients and quality healthcare — making it
            easier to find trusted doctors, book appointments, and manage your health journey online.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title="Our Mission"
            subtitle="Healthcare should be accessible, transparent, and stress-free for everyone."
          />
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              MediCare Connect empowers patients to take control of their healthcare while giving
              doctors the tools to manage their practice efficiently. From verified profiles to
              secure records and seamless booking, we are building the future of digital healthcare.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-[#111827] sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title="How It Works"
            subtitle="Three simple steps to quality care."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5e17eb]/10 text-[#5e17eb]">
                  <Icon size={32} />
                </div>
                <span className="text-sm font-bold text-[#5e17eb]">Step {index + 1}</span>
                <h3 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title="Our Values" subtitle="The principles that guide everything we build." />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <Icon size={28} className="mb-4 text-[#5e17eb]" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
