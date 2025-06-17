"use client";
import { useSettingsContext } from "@/components/settings";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Header } from "./components/header";
import { Panel } from "./components/panel";
import { useEffect } from "react";
import { useLayout } from "@/layouts/app/context/layout-context";
import { Notifications } from "@/components/notifications";
import { AddStaffPrimaryAction } from "./components/add-staff-primary-action";
import { useAuthContext } from "@/auth/hooks";
import { Role } from "hvo-shared";
import { InboxStats } from "./components/stats";
import { InboxContextProvider } from "./contexts/inbox-context";
import InboxFilters from "./components/filters/filters";
import { VideosPanel } from "./components/videos-panel";

export default function InboxView() {
  const { profile } = useAuthContext();
  const { setHeaderTitle, setPrimaryAction } = useLayout();

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
          Hi there
        </Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          {profile?.role === Role.ADMIN ? "Admin" : "Vendor"}!
        </Typography>
      </Stack>
    );

    setPrimaryAction(<AddStaffPrimaryAction />);

    // setSideContent(<Notifications />);

    return () => {
      setHeaderTitle("");
      // setSideContent(null);
      setPrimaryAction(null);
    };
  }, []);

  return (
    <InboxContextProvider>
      <Stack
        sx={{
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
          // height: "100%",
          // height: "calc(100vh - 124px)",
          height: "calc(100vh - 110px)",
        }}
      >
        <Stack spacing={1.5} flex={1} height="100%">
          {/* <InboxStats /> */}
          <InboxFilters />
          <VideosPanel />
        </Stack>
      </Stack>
    </InboxContextProvider>
  );
}
