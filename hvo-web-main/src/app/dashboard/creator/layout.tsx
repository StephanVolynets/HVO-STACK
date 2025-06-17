// "use client";
import { RoleGuard } from "@/auth/guard";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <RoleGuard role={["CREATOR", "CREATOR_ASSISTANT"]}>{children}</RoleGuard>;
}
