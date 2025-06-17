"use client";

import { ComingSoon } from "@/components/coming-soon";
import { Notifications } from "@/components/notifications";
import { useLayout } from "@/layouts/app/context/layout-context";
import { Typography, Stack } from "@mui/material";
import { useEffect } from "react";

export default function YoutubeTracker() {
  const { setHeaderTitle } = useLayout();

  useEffect(() => {
    setHeaderTitle(
      <Stack direction="row" spacing={1.2}>
        <Typography
          variant="h1"
          sx={{
            opacity: 0.75,
            color: "common.surfaceVariant",
            fontWeight: 700,
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Youtube
        </Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Upload Tracker
        </Typography>
      </Stack>
    );

    // setSideContent(<Notifications />);

    // Clean up
    return () => {
      setHeaderTitle("");
      // setSideContent(null);
    };
  }, []);

  return <ComingSoon />;
}
