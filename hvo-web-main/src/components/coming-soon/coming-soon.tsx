// src/app/coming-soon/page.tsx
"use client";

import { Box, Stack, Typography } from "@mui/material";
import { SplashScreen } from "../loading-screen";
import SpinningLogo from "../loading-screen/spinning-logo";

export default function ComingSoonPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SpinningLogo opacity={0.5} size={96} disablePulse />

      <Stack spacing={0.5} alignItems="center">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "#333",
          }}
        >
          Coming Soon
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: "500px",
            marginX: "auto",
            color: "#666",
          }}
        >
          We&apos;re working on something new. Check back soon for updates.
        </Typography>
      </Stack>
    </Box>
  );
}
