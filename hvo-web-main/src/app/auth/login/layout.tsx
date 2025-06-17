"use client";

import AuthAdaptedLayout from "@/layouts/auth/adapted";
import AuthModernLayout from "@/layouts/auth/modern";
import AuthModernCompactLayout from "@/layouts/auth/modern-compact";
import { GuestGuard } from "src/auth/guard";
import AuthClassicLayout from "src/layouts/auth/classic";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      {/* <AuthModernCompactLayout>{children}</AuthModernCompactLayout> */}
      {/* <AuthAdaptedLayout>{children}</AuthAdaptedLayout> */}
      {children}
    </GuestGuard>
  );
}
