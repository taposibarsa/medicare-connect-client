'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  Clock,
  FileText,
  UserCircle,
  Users,
  Stethoscope,
  BarChart3,
} from 'lucide-react';

const NAV_BY_ROLE = {
  patient: [
    { label: 'Overview', href: '/patient', icon: LayoutDashboard },
    { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { label: 'Payments', href: '/patient/payments', icon: CreditCard },
    { label: 'Reviews', href: '/patient/reviews', icon: Star },
  ],
  doctor: [
    { label: 'Overview', href: '/doctor', icon: LayoutDashboard },
    { label: 'Schedule', href: '/doctor/schedule', icon: Clock },
    { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { label: 'Prescriptions', href: '/doctor/prescriptions', icon: FileText },
    { label: 'Profile', href: '/doctor/profile', icon: UserCircle },
  ],
  admin: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ],
};

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] || [];

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#111827]">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Dashboard
        </p>
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== `/${role}` && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#5e17eb]/10 text-[#5e17eb]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#5e17eb] dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
