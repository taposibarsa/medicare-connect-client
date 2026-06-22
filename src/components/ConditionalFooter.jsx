'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

const DASHBOARD_PREFIXES = ['/patient', '/doctor', '/admin', '/dashboard'];

export default function ConditionalFooter() {
  const pathname = usePathname();
  const hideFooter = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (hideFooter) return null;
  return <Footer />;
}
