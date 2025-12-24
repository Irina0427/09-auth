import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import css from './ProfilePage.module.css';
import { getMe } from '@/lib/api/serverApi';

export const metadata: Metadata = {
  title: 'Your Profile on NoteHub',
  description: 'Personal profile for making notes',
  openGraph: {
    title: 'Your Profile on NoteHub',
    description: 'Personal profile for making notes',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note Hub Logo',
      },
    ],
  },
};

export default async function Profile() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? 'https://ac.goit.global/fullstack/default_avatar.jpg'}
            alt={user.email ?? 'User avatar'}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}