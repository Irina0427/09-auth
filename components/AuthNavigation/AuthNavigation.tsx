'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';

const AuthNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      router.replace('/sign-in');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email ?? 'User email'}</p>
        <button type="button" className={css.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  );
};

export default AuthNavigation;