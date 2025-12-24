'use client';

import { register, RegisterData } from '@/lib/api/clientApi';
import css from './SignUpPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/app/api/types';
import { useAuthStore } from '@/lib/store/authStore';

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();

  const handleSignUp = async (formData: FormData) => {
    setError(null);

    const registerData: RegisterData = {
      email: (formData.get('email') as string) ?? '',
      password: (formData.get('password') as string) ?? '',
    };

    try {
      const user = await register(registerData);
      setAuth(user);

      if (user) {
        router.push('/profile');
      }
    } catch (err) {
      const apiErr = err as ApiError;
      const status = apiErr.response?.status;

      if (status === 409) {
        setError('User with this email already exists.');
      } else {
        setError(
          apiErr.response?.data?.error ??
            apiErr.message ??
            'Something went wrong. Please try again.',
        );
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSignUp}>
        <h1 className={css.formTitle}>Sign up</h1>
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
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignUpPage;