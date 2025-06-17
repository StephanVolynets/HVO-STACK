import SvgColor from "@/components/svg-color";
import { Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks/use-auth-context";
import { icon } from "../config-navigation";
import NavButton from "./nav-button";

interface NavigatorFooterProps {
  isExpanded?: boolean;
}

export default function NavigatorFooter({
  isExpanded = true,
}: NavigatorFooterProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { logout } = useAuthContext();

  console.log("[Performance] NavigatorFooter rendered");

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(paths.auth.login);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  return (
    <Stack
      px={1.5}
      pt={1.5}
      pb={3}
      spacing={1}
      sx={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderTop: `1px solid #E6E6E6`,
      }}
    >
      <NavButton
        item={{
          title: "Settings",
          path: paths.dashboard.settings,
          icon: icon("settings-filled"),
        }}
        isExpanded={isExpanded}
        // onClick={() => {
        //   console.log("Settings");
        // }}
      />
      <NavButton
        item={{
          title: "Log out",
          path: "nothing",
          icon: icon("log-out"),
        }}
        isExpanded={isExpanded}
        onClick={handleLogout}
      />
    </Stack>
  );
}
