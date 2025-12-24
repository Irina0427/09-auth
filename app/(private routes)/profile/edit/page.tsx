'use client';

import { updateMe } from '@/lib/api/clientApi';
import css from './ProfileEdit.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/app/api/types';
import { useState } from 'react';

interface EditData {
  username: string;
}

const ProfileEdit = () => {
  const { user, setAuth } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async (formData: FormData) => {
    const editData: EditData = {
      username: (formData.get('username') as string)?.trim() ?? '',
    };

    try {
      const updatedUser = await updateMe(editData);

      setAuth(updatedUser);
      router.push('/profile');
    } catch (err) {
      const apiErr = err as ApiError;
      const message =
        apiErr.response?.data?.error ?? apiErr.message ?? 'Something went wrong. Please try again.';
      setError(message);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar ?? 'https://ac.goit.global/fullstack/default_avatar.jpg'}
            alt={user?.email ?? 'User avatar'}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} action={handleEdit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user?.username ?? ''}
            />
          </div>

          <p>Email: {user?.email}</p>
          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileEdit;