import { Box, Stack, Typography } from "@mui/material";

export default function EmptyState() {
  return (
    <Stack flex={1} spacing={2} justifyContent="center" alignItems="center">
      <Box
        component="img"
        src="/assets/images/check-circle.png"
        sx={{
          width: 192,
          height: 192,
        }}
      />
      <Stack spacing={0.5} alignItems="center" width={470}>
        <Typography
          variant="h1"
          color="common.surfaceVariant"
          //   sx={{ letterSpacing: "-0.01em" }}
        >
          Select Videos
        </Typography>

        <Typography
          variant="bodyLarge"
          color="common.surfaceVariant"
          textAlign="center"
          //   sx={{ lineHeight: 1.5 }}
        >
          For which you would like to bulk download resources or to which you
          would like to bulk submit work
        </Typography>
      </Stack>
    </Stack>
  );
}
