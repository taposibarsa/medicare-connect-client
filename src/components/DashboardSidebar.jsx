'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';
import { useSession } from '@/app/lib/auth-client';
import StatusBadge from '@/components/dashboard/StatusBadge';

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
    { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope, badgeKey: 'pendingDoctors' },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ],
};

function SidebarContent({ role, pathname, onNavigate, badges = {} }) {
  const { data: session } = useSession();
  const user = session?.user;
  const items = NAV_BY_ROLE[role] || [];

  const photo = user?.image || '';
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {photo ? (
            <Image src={photo} alt={user?.name || 'User'} width={40} height={40} className="rounded-full object-cover" unoptimized />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5e17eb]/10 text-sm font-bold text-[#5e17eb]">
              {initials || 'U'}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user?.name}</p>
            <StatusBadge status={role} className="mt-1" />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p>
        {items.map(({ label, href, icon: Icon, badgeKey }) => {
          const isActive = pathname === href || (href !== `/${role}` && pathname.startsWith(href));
          const badge = badgeKey ? badges[badgeKey] : 0;

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#5e17eb]/10 text-[#5e17eb]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#5e17eb] dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={18} />
                {label}
              </span>
              {badge > 0 && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardSidebar({ role, badges = {} }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 lg:hidden dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
        Menu
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#111827]">
            <div className="flex justify-end p-3">
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>
            <SidebarContent role={role} pathname={pathname} onNavigate={() => setMobileOpen(false)} badges={badges} />
          </aside>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <SidebarContent role={role} pathname={pathname} badges={badges} />
        </div>
      </aside>
    </>
  );
}
