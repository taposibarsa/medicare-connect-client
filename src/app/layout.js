import { Inter } from 'next/font/google';

import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});


export const metadata = {
  title: 'MediCare Connect | Healthcare Management',
  description: 'Doctor Appointment & Healthcare Management System',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="light"
    >
      <body className={`${inter.className} antialiased text-slate-800 bg-slate-50`}>

          <main className="min-h-screen">
            {children}
          </main>


      </body>
    </html>
  );
}
