'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import AuthLoading from '@/components/RoleGuard';

const ROLE_ROUTES = {
  patient: '/patient',
  doctor: '/doctor',
  admin: '/admin',
};

export default function DashboardRedirectPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace('/login?callbackUrl=/dashboard');
      return;
    }

    const route = ROLE_ROUTES[session.user.role] || '/';
    router.replace(route);
  }, [session, isPending, router]);

  return <AuthLoading />;
}
