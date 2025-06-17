"use client";

import { AppLayout } from "@/layouts/app";
import DashboardLayout from "@/layouts/dashboard";
import { AuthGuard } from "src/auth/guard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
