// "use client";
import { RoleGuard } from "@/auth/guard";
import { StaffLayout } from "@/layouts/staff-layout";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <StaffLayout>{children}</StaffLayout>;
}

// export default function Layout({ children }: Props) {
//   return (
//     <RoleGuard role="STAFF">
//       <StaffLayout>{children}</StaffLayout>
//     </RoleGuard>
//   );
// }
