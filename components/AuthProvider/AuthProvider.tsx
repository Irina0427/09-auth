'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const fetchSession = async () => {
      const { user, isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated && user) return;

      const hasSession = await checkSession();

      if (!hasSession) {
        clearAuth();
      } else {
        const user = await getMe();
        if (user) {
          setAuth(user);
        }
      }
    };

    fetchSession();
  }, [clearAuth, setAuth]);

  return <>{children}</>;
};

export default AuthProvider;