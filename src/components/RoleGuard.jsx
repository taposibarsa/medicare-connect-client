'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';

const ROLE_PREFIXES = {
  '/patient': 'patient',
  '/doctor': 'doctor',
  '/admin': 'admin',
};

export function useAuthGuard({ redirectTo = '/login' } = {}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session.user.status === 'suspended') {
      router.replace('/login?error=suspended');
    }
  }, [session, isPending, pathname, router, redirectTo]);

  return { session, isPending, isAuthenticated: Boolean(session?.user) };
}

export function useRoleGuard() {
  const auth = useAuthGuard();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (auth.isPending || !auth.session?.user) return;

    const prefix = Object.keys(ROLE_PREFIXES).find((p) => pathname.startsWith(p));

    if (prefix) {
      const requiredRole = ROLE_PREFIXES[prefix];
      if (auth.session.user.role !== requiredRole) {
        router.replace('/dashboard');
      }
    }
  }, [auth.session, auth.isPending, pathname, router]);

  return auth;
}

export default function AuthLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5e17eb] border-t-transparent" />
    </div>
  );
}
