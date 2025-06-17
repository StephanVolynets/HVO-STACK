import { Stack, Typography, Box } from "@mui/material";
import SvgColor from "../svg-color";

export default function Notifications() {
  return (
    <Stack sx={{ height: "100%" }}>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ height: "32px" }}
      >
        <SvgColor src="/assets/icons/notification.svg" />
        <Typography
          variant="bodyLargeStrong"
          color="primary.surface"
          sx={{ opacity: 0.75 }}
        >
          Updates
        </Typography>
      </Stack>

      <Stack
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <SvgColor
          src="/assets/icons/notification.svg"
          sx={{
            width: 48,
            height: 48,
            mb: 2,
            color: "primary.surface",
            opacity: 0.7,
          }}
        />

        <Typography
          variant="h6"
          color="primary.surface"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          Coming Soon
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 240 }}
        >
          Notification center is under development. Stay tuned for updates!
        </Typography>
      </Stack>
    </Stack>
  );
}
