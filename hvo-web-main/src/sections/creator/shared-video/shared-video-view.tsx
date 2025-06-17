"use client";

import { Stack, useMediaQuery, useTheme } from "@mui/material";
import VideoPreview from "./components/video-preview";
import VideoDescription from "./components/video-description";
import { VideoControls } from "./components/video-controls";
import VideoTitle from "./components/video-title";

export default function SharedVideoView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      sx={{
        m: isMobile ? 0 : 3,
        mb: 0,
        p: 1.5,
        display: "flex",
        alignItems: "center",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "common.background",
        // Make the stack scrollable
        minHeight: 0,
        overflow: "auto",
        height: "100vh",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1024,
          alignItems: "center",
        }}
      >
        <VideoPreview />
        <VideoTitle />
        <VideoControls />
        <VideoDescription />
      </Stack>
    </Stack>
  );
}
