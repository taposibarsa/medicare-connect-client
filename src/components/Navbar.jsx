'use client';
import {
  Home,
  Stethoscope,
  Info,
  Phone,
  Sun,
  Moon,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from "next/image";

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

  // Login এবং Register বাটনের টগল লজিক (Active State Styling)
  const isLoginPage = pathname === '/login';
  
  const loginBtnClasses = isLoginPage
    ? "bg-[#5e17eb] text-white shadow-md shadow-[#5e17eb]/30 hover:bg-[#4a12bc]" // Active (Solid)
    : "bg-[#5e17eb]/10 text-[#5e17eb] hover:bg-[#5e17eb]/20"; // Inactive (Flat)

  const registerBtnClasses = !isLoginPage
    ? "bg-[#5e17eb] text-white shadow-md shadow-[#5e17eb]/30 hover:bg-[#4a12bc]" // Active (Solid)
    : "bg-[#5e17eb]/10 text-[#5e17eb] hover:bg-[#5e17eb]/20"; // Inactive (Flat)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Mobile: Hamburger Button (Left aligned) */}
        <button
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-[#5e17eb] hover:bg-[#5e17eb]/10 transition-colors"
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

        {/* Logo (Right on mobile, Left on desktop) */}
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
              <p className="text-slate-800 text-2xl font-bold">
                MediCare<span className="text-2xl font-bold tracking-tight text-[#5e17eb]">Connect</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Menu - Center */}
        <ul className="hidden lg:flex flex-1 justify-center items-center gap-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    isActive 
                      ? 'text-[#5e17eb] bg-violet-50 font-medium' 
                      : 'text-slate-600 hover:bg-violet-50 hover:text-[#5e17eb]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Buttons - Right */}
        <div className="hidden lg:flex items-center gap-3">
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
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 px-4 py-4 lg:hidden bg-white shadow-lg">
          <ul className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full py-3 px-4 rounded-lg text-lg font-medium flex items-center gap-3 transition-colors ${
                      isActive 
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
          </ul>
          
          {/* Mobile Buttons */}
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
        </div>
      )}
    </header>
  );
}