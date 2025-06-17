import { useAuthContext } from "@/auth/hooks";
import { Box, Stack, Typography } from "@mui/material";
import { StaffType } from "hvo-shared";

export default function NoFilesState() {
  const { profile } = useAuthContext();

  const getFileTypesText = () => {
    switch (profile?.staffType) {
      case StaffType.TRANSCRIPTOR:
        return "Transcript";
      case StaffType.TRANSLATOR:
        return "Translated";
      case StaffType.VOICE_ACTOR:
        return "Voice Over";
      case StaffType.AUDIO_ENGINEER:
        return "Mixed";
      default:
        return "ERROR";
    }
  };

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
        src="/assets/images/file-upload.png"
        sx={{
          width: 128,
          height: 128,
        }}
      />
      <Stack spacing={0.5} alignItems="center">
        <Typography fontSize={32} fontWeight={500} color="#333333">
          Upload Your
          <Box
            component="span"
            px={2.5}
            py={1}
            mx={1.25}
            sx={{
              borderRadius: "20px",
              backgroundColor: "rgba(38, 38, 38, 0.05)",
              border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
              color: "rgba(51, 51, 51, 0.7)",
            }}
          >
            {getFileTypesText()}
          </Box>
          Files Here
        </Typography>
        <Typography fontSize={18} fontWeight={400}>
          Drag and drop, or click to select from your computer&apos;s files
        </Typography>
      </Stack>
    </Stack>
  );
}
