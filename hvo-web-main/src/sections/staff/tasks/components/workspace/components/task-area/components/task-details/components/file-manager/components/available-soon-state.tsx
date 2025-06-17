import { useAuthContext } from "@/auth/hooks";
import SvgColor from "@/components/svg-color";
import { Box, Stack, Typography } from "@mui/material";
import { StaffType } from "hvo-shared";

export default function AvailableSoonState() {
  const { profile } = useAuthContext();

  return (
    <Stack
      flex={1}
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%" }}
    >
      <Box
        component="img"
        src="/assets/images/history-toggle-off.png"
        sx={{
          width: 128,
          height: 128,
        }}
      />
      <Stack spacing={0.5} alignItems="center">
        <Typography fontSize={32} fontWeight={500} color="#333333">
          The task will be available soon
        </Typography>
        <Typography fontSize={18} fontWeight={400}>
          Transcription completed, it should be on your plate in no-time
        </Typography>
      </Stack>
    </Stack>
  );
}
