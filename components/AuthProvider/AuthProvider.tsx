"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Loading from "@/app/loading";

type Props = {
  children: React.ReactNode;
};

const PRIVATE_PREFIXES = ["/notes", "/profile"];

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isPrivateRoute = useMemo(
    () => PRIVATE_PREFIXES.some((p) => pathname.startsWith(p)),
    [pathname],
  );

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsChecking(true);

      const ok = await checkSession();

      if (!ok) {
        clearIsAuthenticated();

        if (isPrivateRoute) {
          try {
            await logout();
          } catch {
            // ignore
          }
          if (!cancelled) router.replace("/sign-in");
        }

        if (!cancelled) setIsChecking(false);
        return;
      }

      try {
        const user = await getMe();
        if (!cancelled) setUser(user);
      } catch {
        clearIsAuthenticated();
        if (isPrivateRoute) router.replace("/sign-in");
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isPrivateRoute, pathname, router, setUser, clearIsAuthenticated]);

  if (isChecking && isPrivateRoute) return <Loading />;

  return <>{children}</>;
}
