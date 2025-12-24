

'use client';

import { useRouter } from 'next/navigation';
import css from './SignInPage.module.css';
import { useState } from 'react';
import { login, LoginData } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/types';
import { useAuthStore } from '@/lib/store/authStore';

export default function SignInPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (formData: FormData) => {
    setError(null);

    const loginData: LoginData = {
      email: (formData.get('email') as string) ?? '',
      password: (formData.get('password') as string) ?? '',
    };

    try {
      const user = await login(loginData);
      setAuth(user);

      if (user) {
        router.push('/profile');
      }
    } catch (err) {
      const apiErr = err as ApiError;

      const message =
        apiErr.response?.data?.error ?? apiErr.message ?? 'Something went wrong. Please try again.';

      setError(message);
    }
  };
  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSignIn}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}