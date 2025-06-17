import { useAuthContext } from "@/auth/hooks";
import CreatorImage from "@/components/images/creator-image";
import SvgColor from "@/components/svg-color";
import { paths } from "@/routes/paths";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

export default function AccountSection() {
  const { logout, role, profile } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

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
    <Stack direction="row" spacing={1.5} p={2} alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1.5} alignItems="center">
        <CreatorImage src={profile?.photo_url} />
        <Stack spacing={0}>
          <Typography variant="bodyRegularStrong">{profile?.full_name}</Typography>
          <Typography variant="captionSmall">
            {capitalize(
              role
                ?.toLowerCase()
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") || ""
            )}
          </Typography>
        </Stack>
      </Stack>

      <Button
        sx={{ borderRadius: "4px", border: "solid 1px #E6E6E6", maxWidth: 32, minWidth: 32, height: 32, p: 0 }}
        onClick={handleLogout}
      >
        <SvgColor src="/assets/icons/logout.svg" />
      </Button>
    </Stack>
  );
}
