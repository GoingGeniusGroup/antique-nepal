'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export function AuthSuccessHandler() {
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && data?.user?.image) {
      const hasShown = sessionStorage.getItem('loginSuccessToastShown');
      if (!hasShown) {
        toast.success('Logged in successfully!');
        sessionStorage.setItem('loginSuccessToastShown', 'true');
      }
    }

    if (status === 'unauthenticated') {
      sessionStorage.removeItem('loginSuccessToastShown');
    }
  }, [status, data]);

  return null; // This component does not render any UI.
}
