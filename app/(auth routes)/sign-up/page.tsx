"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { register, type RegisterData } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./SignUpPage.module.css";

type ApiError = {
  message?: string;
  response?: {
    status?: number;
    data?: { error?: string };
  };
};

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((s) => s.setUser);

  const handleSignUp = async (formData: FormData) => {
    setError(null);

    const payload: RegisterData = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const user = await register(payload);
      setUser(user);
      router.push("/profile");
    } catch (err) {
      const apiErr = err as ApiError;
      const status = apiErr.response?.status;

      if (status === 409) setError("User with this email already exists.");
      else setError(apiErr.response?.data?.error ?? apiErr.message ?? "Something went wrong.");
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
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
