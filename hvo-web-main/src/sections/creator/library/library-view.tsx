"use client";
import { Stack, Typography, Box } from "@mui/material";
import { LibraryStats } from "./components/library-stats";
import { useLayout } from "@/layouts/app/context/layout-context";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/auth/hooks";
import { Notifications } from "@/components/notifications";
import { LibraryVideos } from "./components/library-videos";
import { LibraryFilters } from "./components/library-filters";
import { LibraryProvider } from "./contexts/library-context";
import { FloatingDownloadButton } from "./components/download-resources-button/floating-download-button";
import { LibraryPrimaryAction } from "./components/library-primary-action";
import { getManagerName } from "@/apis/creator";

export default function LibraryView() {
  const { profile, role } = useAuthContext();
  const { setHeaderTitle, setSideContent, setPrimaryAction } = useLayout();
  const [managerName, setManagerName] = useState<string | null>(null);

  // Check if user is an assistant
  const isAssistant = role?.includes("ASSISTANT");

  useEffect(() => {
    // Fetch manager name if user is an assistant
    if (isAssistant && profile?.id) {
      getManagerName(profile.id)
        .then((data) => {
          setManagerName(data?.managerName || null);
        })
        .catch((error) => {
          console.error("Failed to fetch manager name:", error);
          setManagerName(null);
        });
    }
  }, [isAssistant, profile?.id]);

  useEffect(() => {
    const displayName = isAssistant ? managerName : profile?.firstName;

    if (displayName) {
      setHeaderTitle(
        <Stack direction="row" spacing={1.2}>
          <Typography
            variant="h1"
            sx={{
              opacity: 0.75,
              color: "common.surfaceVariant",
              fontWeight: 700,
            }}
          >
            Hi there
          </Typography>
          <Typography variant="h1" fontWeight={700}>
            {displayName}!
          </Typography>
        </Stack>
      );
    }

    setPrimaryAction(<LibraryPrimaryAction displayBulkButton />);

    return () => {
      setHeaderTitle("");
      setSideContent(null);
      setPrimaryAction(null);
    };
  }, [
    profile?.firstName,
    isAssistant,
    managerName,
    setHeaderTitle,
    setPrimaryAction,
    setSideContent,
  ]);

  return (
    <LibraryProvider>
      <Box>
        <Stack spacing={3}>
          <LibraryStats />
          <LibraryFilters />
          <LibraryVideos />
        </Stack>
        <FloatingDownloadButton />
      </Box>
    </LibraryProvider>
  );
}
