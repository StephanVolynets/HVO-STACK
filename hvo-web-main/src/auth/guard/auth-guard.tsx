"use client";

import { useState, useEffect, useCallback } from "react";

import { paths } from "src/routes/paths";
import { useParams, usePathname, useRouter } from "src/routes/hooks";

import { SplashScreen } from "src/components/loading-screen";

import { useAuthContext } from "../hooks";
import { validateStaffJWT } from "@/apis/auth";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const { authenticated, method, signInWithToken } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const removeTokenFromURL = (searchParams: any) => {
    // Remove the token from the URL
    searchParams.delete("token");
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleStaffAuthentication = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (!token) {
      // No token in URL, redirect to staff login
      router.replace(paths.auth.login);
      return;
    }

    try {
      // Validate the token with the backend
      const { firebaseToken } = await validateStaffJWT(token);

      // Sign in with Firebase
      await signInWithToken(firebaseToken);

      // Remove the token from the URL
      searchParams.delete("token");
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newUrl);

      setChecked(true);
    } catch (error) {
      console.error("Invalid or expired token:", error);
      router.replace(paths.auth.login);
    }
  }, [router]);

  const check = useCallback(() => {
    if (authenticated) {
      // If the user is already authenticated, ensure they can proceed
      setChecked(true);
    } else if (pathname.startsWith("/dashboard/staff/")) {
      // Special case for staff routes: validate token
      handleStaffAuthentication();
    } else {
      // General authentication check for other routes
      const returnTo = pathname;
      const loginPath = paths.auth.login;
      const href = `${loginPath}?returnTo=${encodeURIComponent(returnTo)}`;
      router.replace(href);
    }
  }, [authenticated, method, router, handleStaffAuthentication, pathname]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

// const currentPath = router;

// if (!authenticated) {
//   const searchParams = new URLSearchParams({
//     returnTo: window.location.pathname,
//   }).toString();

//   const loginPath = paths.auth.login;

//   const href = `${loginPath}?${searchParams}`;

//   router.replace(href);
// } else {
//   setChecked(true);
// }
