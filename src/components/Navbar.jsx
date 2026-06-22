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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80  backdrop-blur-md dark:bg-[#111827] dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#5e17eb] hover:bg-[#5e17eb]/10 transition-colors"
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

          <ThemeSwitcher />
        </div>

        <div className="flex flex-1 justify-end lg:flex-none lg:justify-start">
          <Link href="/">
            <div className='flex items-center gap-1'>
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                priority
              />
              <p className="text-slate-800 dark:text-white text-2xl font-bold">
                MediCare<span className="text-2xl font-bold tracking-tight text-[#5e17eb]">Connect</span>
              </p>
            </div>
          </Link>
        </div>

        <ul className="hidden lg:flex flex-1 justify-center items-center gap-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${isActive
                    ? 'text-[#5e17eb] bg-violet-50 dark:bg-[#5e17eb]/10 font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-[#5e17eb] dark:hover:text-[#5e17eb]'
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
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                  pathname.startsWith('/patient') ||
                  pathname.startsWith('/doctor') ||
                  pathname.startsWith('/admin') ||
                  pathname === '/dashboard'
                    ? 'text-[#5e17eb] bg-violet-50 dark:bg-[#5e17eb]/10 font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-800 hover:text-[#5e17eb]'
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeSwitcher />
          {!isPending && isLoggedIn ? (
            <UserProfileDropdown user={session.user} />
          ) : !isPending ? (
            <>
              <Button
                className={`px-6 font-medium transition-all duration-200 ${loginBtnClasses}`}
                onPress={() => router.push('/login')}
              >
                Login
              </Button>
              <Button
                className={`px-6 font-medium transition-all duration-200 ${registerBtnClasses}`}
                onPress={() => router.push('/register')}
              >
                Register
              </Button>
            </>
          ) : null}
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-200 px-4 py-4 lg:hidden bg-white shadow-lg dark:bg-[#111827]">
          <div className="mb-4 flex justify-between items-center">
            <span className="font-medium text-slate-600 dark:text-slate-300">Theme</span>
            <ThemeSwitcher />
          </div>
          <ul className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full py-3 px-4 rounded-lg text-lg font-medium flex items-center gap-3 transition-colors ${isActive
                      ? 'text-[#5e17eb] bg-violet-50'
                      : 'text-slate-700 hover:bg-slate-50'
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
                  className="block w-full py-3 px-4 rounded-lg text-lg font-medium flex items-center gap-3 text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {!isPending && isLoggedIn ? (
            <div className="flex justify-center">
              <UserProfileDropdown user={session.user} />
            </div>
          ) : !isPending ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className={`w-full py-6 text-base font-medium transition-all duration-200 ${loginBtnClasses}`}
                onPress={() => { setIsMenuOpen(false); router.push('/login'); }}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Button>
              <Button
                className={`w-full py-6 text-base font-medium transition-all duration-200 ${registerBtnClasses}`}
                onPress={() => { setIsMenuOpen(false); router.push('/register'); }}
              >
                <UserPlus size={18} className="mr-2" />
                Register
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}
