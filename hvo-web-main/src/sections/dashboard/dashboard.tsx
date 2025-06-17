"use client";

import { useAuthContext } from "@/auth/hooks";
import { PATH_AFTER_LOGIN } from "@/config-global";
import { paths } from "@/routes/paths";
import { FC, useEffect } from "react";
import { useRouter } from "src/routes/hooks";
import NoRoleView from "../error/no-role";

interface IProps {}

const DashboardView: FC<IProps> = ({}: IProps) => {
  const { role } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    switch (role) {
      case "ADMIN":
        router.push(paths.dashboard.admin.root);
        break;
      case "ADMIN_ASSISTANT":
        router.push(paths.dashboard.admin.root);
        break;
      case "VENDOR_ASSISTANT":
        router.push(paths.dashboard.vendor.root);
        break;
      case "VENDOR":
        router.push(paths.dashboard.vendor.root);
        break;
      case "STAFF":
        router.push(paths.dashboard.staff.root);
        break;
      case "CREATOR":
        router.push(paths.dashboard.creator.root);
        break;
      case "CREATOR_ASSISTANT":
        router.push(paths.dashboard.creator.root);
        break;
      default:
        router.push(paths.auth.login);
    }
  }, [router]);

  // return <NoRoleView />;
  return null;
  // User has to be redirected to the dashboard based on their role.
  // In case user has no role, we show a message that they have no role.
  // But that should not happen in a real-world scenario.
};

export default DashboardView;
