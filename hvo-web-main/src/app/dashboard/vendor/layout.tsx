// "use client";
import RoleGuard from "@/auth/guard/role-guard";
import DashboardLayout from "@/layouts/dashboard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <RoleGuard role={["VENDOR", "VENDOR_ASSISTANT"]}>{children}</RoleGuard>;
}
