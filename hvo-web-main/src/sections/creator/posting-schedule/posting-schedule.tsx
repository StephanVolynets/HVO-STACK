"use client";

import ComingSoonIllustration from "@/assets/illustrations/coming-soon-illustration";
import { ComingSoon } from "@/components/coming-soon";
import { Notifications } from "@/components/notifications";
import { useLayout } from "@/layouts/app/context/layout-context";
import { Typography, Stack } from "@mui/material";
import { useEffect } from "react";

export default function PostingSchedule() {
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
          Content
        </Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Calendar
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
