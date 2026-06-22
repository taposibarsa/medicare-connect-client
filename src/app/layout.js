import { Inter } from 'next/font/google';

import "./globals.css";
import AppNavbar from '@/components/Navbar';
import { Providers } from './providers';
import ConditionalFooter from '@/components/ConditionalFooter';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});


export const metadata = {
  title: 'MediCare Connect | Healthcare Management',
  description: 'Doctor Appointment & Healthcare Management System',
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased text-slate-800 bg-slate-50 dark:bg-[#0f172a]/80 dark:text-slate-200`}>
        <Providers>
          <AppNavbar />
          <main>
            {children}
          </main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
