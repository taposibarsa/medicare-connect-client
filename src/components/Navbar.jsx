'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Find Doctors', path: '/find-doctors' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#5e17eb] sm:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link href="/">
            <p className="text-2xl font-bold tracking-tight text-[#5e17eb]">
              MediCare<span className="text-slate-800">+</span>
            </p>
          </Link>
        </div>

        <ul className="hidden items-center gap-8 sm:flex">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-[#5e17eb]'
                      : 'text-slate-600 hover:text-[#5e17eb]'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            className="hidden bg-[#5e17eb]/10 px-6 font-medium text-[#5e17eb] sm:inline-flex"
            onPress={() => router.push('/login')}
          >
            Login
          </Button>
          <Button
            className="bg-[#5e17eb] px-6 font-medium text-white shadow-md shadow-[#5e17eb]/30"
            onPress={() => router.push('/register')}
          >
            Register
          </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-200 px-4 py-4 sm:hidden">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full py-2 text-lg font-medium ${
                      isActive ? 'text-[#5e17eb]' : 'text-slate-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button
            variant="bordered"
            className="mt-4 w-full border-[#5e17eb] font-medium text-[#5e17eb]"
            onPress={() => {
              setIsMenuOpen(false);
              router.push('/login');
            }}
          >
            Login
          </Button>
        </div>
      )}
    </header>
  );
}
