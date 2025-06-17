import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function DownloadGenerating() {
  return (
    <Stack
      flex={1}
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%" }}
    >
      <CircularProgress
        size={70}
        thickness={2.5}
        sx={{
          color: "primary.main",
        }}
      />

      <Stack spacing={0} alignItems="center">
        <Typography
          variant="h1"
          color="common.surfaceVariant"
          sx={{ letterSpacing: "-0.01em" }}
        >
          Preparing your download
        </Typography>

        <Typography
          variant="bodyLarge"
          color="common.surfaceVariant"
          // fontSize={18}
          // fontWeight={400}
          // color="text.secondary"
          maxWidth={560}
          textAlign="center"
          sx={{ lineHeight: 1.5 }}
        >
          We&apos;re generating your files. This should only take a moment.
        </Typography>
      </Stack>
    </Stack>
  );
}
