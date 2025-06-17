import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";
import { Stack, Typography } from "@mui/material";

export default function SubmittedMessage() {
  return (
    <Stack
      p={2}
      spacing={1}
      direction="row"
      alignItems="center"
      sx={{ backgroundColor: "common.white", borderRadius: "8px", border: "1px solid #E0E0E0" }}
    >
      {/* <SvgColor src="/assets/icons/check.svg" color="pink" /> */}
      <Iconify icon="bx:bxs-check-circle" color="common.green" width={24} height={24} />
      <Typography variant="bodyLargeStrong">You have completed the task</Typography>
    </Stack>
  );
}
