// "use client";
import { RoleGuard } from "@/auth/guard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <RoleGuard role={["ADMIN", "ADMIN_ASSISTANT"]}>{children}</RoleGuard>;
}
