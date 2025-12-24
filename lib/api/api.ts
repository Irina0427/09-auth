import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api`;

/**
 * Shared axios instance for both client & server calls to Next.js API routes (app/api/*).
 * Cookies are used for auth, so withCredentials must be enabled.
 */
export const api = axios.create({
  baseURL,
  withCredentials: true,
});
