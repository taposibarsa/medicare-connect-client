import Link from "next/link";
import Image from "next/image";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  ChevronRight 
} from "lucide-react";

// Custom SVG Icons for Social Media (যেহেতু Lucide এগুলো সরিয়ে দিয়েছে)
const FacebookIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Find Doctors", path: "/find-doctors" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
  { name: "Dashboard", path: "/dashboard" },
];

const socialLinks = [
  { icon: FacebookIcon, path: "#" },
  { icon: TwitterIcon, path: "#" },
  { icon: InstagramIcon, path: "#" },
  { icon: LinkedinIcon, path: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-violet-50 dark:border-slate-800 dark:bg-[#0f172a] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-1">
                <Image
                  src="/logo.png"
                  alt="MediCare Connect Logo"
                  width={40}
                  height={40}
                />
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  MediCare<span className="tracking-tight text-[#5e17eb]">Connect</span>
                </p>
              </div>
            </Link>
            <p className="text-slate-600 dark:text-slate-400">
              A modern healthcare management platform connecting patients with top doctors and hospitals for a seamless medical experience.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.path}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-[#5e17eb] hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-[#5e17eb] dark:hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="group flex items-center text-slate-600 transition-colors hover:text-[#5e17eb] dark:text-slate-400 dark:hover:text-[#5e17eb]"
                  >
                    <ChevronRight size={16} className="mr-2 opacity-0 transition-all group-hover:opacity-100 text-[#5e17eb]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <MapPin size={20} className="mt-0.5 shrink-0 text-[#5e17eb]" />
                <span>123 Healthcare Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <PhoneCall size={20} className="shrink-0 text-[#5e17eb]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={20} className="shrink-0 text-[#5e17eb]" />
                <span>support@medicareconnect.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Hotline */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
              Emergency Services
            </h3>
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
              <PhoneCall size={32} className="mb-4 text-red-500" />
              <p className="mb-1 font-medium text-slate-800 dark:text-slate-200">
                24/7 Emergency Hotline
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                911 / 102
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Call immediately for critical medical emergencies.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row">
          <p className="text-slate-600 dark:text-slate-400 text-center md:text-left">
            &copy; {currentYear} MediCare Connect. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <Link href="/privacy" className="text-sm text-slate-600 hover:text-[#5e17eb] dark:text-slate-400 dark:hover:text-[#5e17eb]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-600 hover:text-[#5e17eb] dark:text-slate-400 dark:hover:text-[#5e17eb]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
