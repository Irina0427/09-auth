"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login, type LoginData } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./SignInPage.module.css";

type ApiError = {
  message?: string;
  response?: {
    status?: number;
    data?: { error?: string };
  };
};

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const setUser = useAuthStore((s) => s.setUser);

  const handleSignIn = async (formData: FormData) => {
    setError("");

    const payload: LoginData = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const user = await login(payload);
      setUser(user);
      router.push("/profile");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.response?.data?.error ?? apiErr.message ?? "Login failed");
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
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
