import SvgColor from "@/components/svg-color";
import { Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks/use-auth-context";

export default function NavigatorFooter() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { logout } = useAuthContext();

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
      px={2}
      pt={1.5}
      pb={3}
      spacing={1}
      sx={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderTop: `1px solid #E6E6E6`,
      }}
    >
      {/* <Button
        size="large"
        startIcon={<SvgColor src="/assets/icons/settings-filled.svg" />}
        sx={{
          justifyContent: "flex-start",
          pl: 2.5,
        }}
      >
        Settings
      </Button> */}
      <Button
        size="large"
        startIcon={<SvgColor src="/assets/icons/logout.svg" />}
        sx={{
          justifyContent: "flex-start",
          pl: 2.5,
        }}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Stack>
  );
}
