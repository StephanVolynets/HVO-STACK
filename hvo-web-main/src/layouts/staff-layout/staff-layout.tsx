"use client";

import { useAuthContext } from "@/auth/hooks";
import { SplashScreen } from "@/components/loading-screen";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function StaffLayout({ children }: Props) {
  const { authenticated, loading } = useAuthContext();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  if (!authenticated && loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
