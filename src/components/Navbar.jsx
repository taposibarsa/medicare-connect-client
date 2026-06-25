'use client';
import {
  Home,
  Stethoscope,
  Info,
  Phone,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { useState } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from "next/image";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSession } from '@/app/lib/auth-client';
import UserProfileDropdown from './UserProfileDropdown';

const menuItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Find Doctors", path: "/find-doctors", icon: Stethoscope },
  { name: "About Us", path: "/about", icon: Info },
  { name: "Contact Us", path: "/contact", icon: Phone },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const isLoggedIn = Boolean(session?.user);
  const isLoginPage = pathname === '/login';

  const loginBtnClasses = isLoginPage
    ? "bg-[#5e17eb] text-white shadow-md shadow-[#5e17eb]/30 hover:bg-[#4a12bc]"
    : "bg-[#5e17eb]/10 text-[#5e17eb] hover:bg-[#5e17eb]/20";

  const registerBtnClasses = !isLoginPage
    ? "bg-[#5e17eb] text-white shadow-md shadow-[#5e17eb]/30 hover:bg-[#4a12bc]"
    : "bg-[#5e17eb]/10 text-[#5e17eb] hover:bg-[#5e17eb]/20";

  const dashboardActive =
    pathname.startsWith('/patient') ||
    pathname.startsWith('/doctor') ||
    pathname.startsWith('/admin') ||
    pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#111827] dark:text-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#5e17eb] transition-colors hover:bg-[#5e17eb]/10"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <Link href="/" className="flex min-w-0 shrink items-center gap-2 lg:mr-4">
          <Image
            src="/logo.png"
            alt="MediCare Connect logo"
            width={36}
            height={36}
            className="shrink-0"
            priority
          />
          <p className="truncate text-base font-bold text-slate-800 dark:text-white sm:text-lg lg:text-2xl">
            MediCare<span className="text-[#5e17eb]">Connect</span>
          </p>
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex xl:gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive
                      ? 'bg-violet-50 font-medium text-[#5e17eb] dark:bg-[#5e17eb]/10'
                      : 'text-slate-600 hover:bg-violet-50 hover:text-[#5e17eb] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#5e17eb]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
          {isLoggedIn && (
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                  dashboardActive
                    ? 'bg-violet-50 font-medium text-[#5e17eb] dark:bg-[#5e17eb]/10'
                    : 'text-slate-600 hover:bg-violet-50 hover:text-[#5e17eb] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#5e17eb]'
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
          )}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>

          {!isPending && isLoggedIn ? (
            <UserProfileDropdown user={session.user} />
          ) : !isPending ? (
            <>
              <Button
                size="sm"
                className={`hidden font-medium transition-all duration-200 sm:inline-flex ${loginBtnClasses}`}
                onPress={() => router.push('/login')}
              >
                Login
              </Button>
              <Button
                size="sm"
                className={`hidden font-medium transition-all duration-200 sm:inline-flex ${registerBtnClasses}`}
                onPress={() => router.push('/register')}
              >
                Register
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="text-[#5e17eb] sm:hidden"
                aria-label="Login"
                onPress={() => router.push('/login')}
              >
                <LogIn size={18} />
              </Button>
            </>
          ) : null}
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-[#111827] lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Theme</span>
            <ThemeSwitcher />
          </div>

          <ul className="mb-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-violet-50 text-[#5e17eb] dark:bg-[#5e17eb]/10'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
            {isLoggedIn && (
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    dashboardActive
                      ? 'bg-violet-50 text-[#5e17eb] dark:bg-[#5e17eb]/10'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {!isPending && !isLoggedIn && (
            <div className="flex flex-col gap-3">
              <Button
                className={`w-full py-5 text-base font-medium transition-all duration-200 ${loginBtnClasses}`}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/login');
                }}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Button>
              <Button
                className={`w-full py-5 text-base font-medium transition-all duration-200 ${registerBtnClasses}`}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push('/register');
                }}
              >
                <UserPlus size={18} className="mr-2" />
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
