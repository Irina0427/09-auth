"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfilePage.module.css";


type ApiError = {
  message?: string;
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
};

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {

        if (user) {
          setUsername(user.username ?? "");
          return;
        }

        const me = await getMe();
        setUser(me);
        setUsername(me.username ?? "");
      } catch (e) {

        const err = e as ApiError;
        setError(err.response?.data?.error ?? err.message ?? "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    load();
   
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const value = username.trim();
    if (!value) {
      setError("Username is required");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateMe({ username: value });
      setUser(updated);
      router.push("/profile");
    } catch (e) {
      const err = e as ApiError;
      const msg =
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        "Failed to update profile";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className={css.mainContent}>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar ?? "https://ac.goit.global/fullstack/react/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email ?? "—"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isSaving}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
