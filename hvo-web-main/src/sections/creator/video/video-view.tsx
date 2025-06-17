"use client";

import { Box, Stack, Typography } from "@mui/material";
import VideoPreview from "./components/video-preview";
import VideoDescription from "./components/video-description";
import { useGetVideoPreview } from "@/use-queries/video";
import VideoFeedbacks from "./components/video-feedbacks/video-feedbacks";
import { useLayout } from "@/layouts/app/context/layout-context";
import { useEffect } from "react";
import HeaderActions from "./components/header-actions";
import { VideoControls } from "./components/video-controls";
import { LibraryPrimaryAction } from "../library/components/library-primary-action";
import { useSelectedLanguage } from "../shared-video/hooks/use-selected-language";

export default function VideoView() {
  const { isLoading, video } = useGetVideoPreview();

  const {
    setHeaderTitle,
    setHeaderActions,
    setPrimaryAction,
    setSideContent,
    setSidebarWidth,
  } = useLayout();

  useEffect(() => {
    setSidebarWidth(360);

    setHeaderTitle(
      <Typography
        variant="h1"
        color="common.surfaceVariant"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 700,
          fontSize: "2rem",
          lineHeight: "2.5rem",
        }}
      >
        {video?.title}
      </Typography>
    );

    setHeaderActions([<HeaderActions key="header-actions" />]);

    setPrimaryAction(<LibraryPrimaryAction />);

    setSideContent(<VideoFeedbacks />);

    // Clean up
    return () => {
      setHeaderTitle("");
      setSideContent(null);
      setHeaderActions([]);
    };
  }, [
    video,
    setHeaderTitle,
    setHeaderActions,
    setPrimaryAction,
    setSideContent,
    setSidebarWidth,
  ]);

  return (
    <Stack
      sx={{
        pt: 4.5,
        px: 4.5,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1200,
          alignItems: "center",
        }}
      >
        <VideoPreview />
        <VideoControls />
        <VideoDescription />
      </Stack>
    </Stack>
  );
}
