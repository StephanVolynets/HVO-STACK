import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { Stack, Typography } from "@mui/material";

export default function UpcomingTaskMessage() {
  return (
    <Stack
      p={2}
      spacing={1}
      direction="row"
      alignItems="center"
      sx={{ backgroundColor: "common.white", borderRadius: "8px", border: "1px solid #E0E0E0" }}
    >
      <Iconify icon="mdi:calendar-clock" color="primary.main" width={24} height={24} />
      <Typography variant="bodyLargeStrong">This task will be available soon</Typography>
    </Stack>
  );
}
