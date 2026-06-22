'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import AppToaster from '@/components/AppToaster';

export function Providers({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
      <AppToaster />
    </NextThemesProvider>
  );
}