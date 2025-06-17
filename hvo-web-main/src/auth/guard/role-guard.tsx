"use client";

import { useState, useEffect, useCallback } from "react";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useAuthContext } from "../hooks";
import { UserRole } from "../types";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  role: UserRole[];
};

export default function RoleGuard({ children, role }: Props) {
  return <Container role={role}>{children}</Container>;
}

// ----------------------------------------------------------------------

function Container({ children, role }: Props) {
  const router = useRouter();

  const { user } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(async () => {
    if (user) {
      const tokenResult = await user.getIdTokenResult();
      const userRole = tokenResult.claims.role;

      // if ((role === "Staff" && STAFF_ROLES.includes(userRole)) || role === userRole) {
      if (role.includes(userRole)) {
        setChecked(true);
      } else {
        router.replace(paths.page403);
      }
    }
  }, [user, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
