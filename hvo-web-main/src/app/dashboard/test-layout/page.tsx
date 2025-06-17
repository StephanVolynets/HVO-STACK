"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useLayout } from "@/layouts/app/context/layout-context";
import { useEffect } from "react";
import { Add } from "@mui/icons-material";
import { useAuthContext } from "@/auth/hooks";

export default function TestLayoutPage() {
  const { setHeaderTitle, setHeaderActions, setPrimaryAction, setSideContent } =
    useLayout();
  const { profile } = useAuthContext();

  useEffect(() => {
    setHeaderTitle(
      <Stack direction="row" spacing={1.5}>
        <Typography
          variant="display2"
          sx={{
            opacity: 0.75,
            color: "common.surfaceVariant",
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Hi there
        </Typography>
        <Typography
          variant="display2"
          fontWeight={700}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          Creator!
        </Typography>
      </Stack>
    );
    console.log("Header title set!");

    // Set action buttons for the header
    setHeaderActions(
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" size="small">
          Filter
        </Button>
        <Button variant="outlined" size="small">
          Export
        </Button>
      </Stack>
    );

    // Set the primary action button next to user avatar
    setPrimaryAction(
      <Button variant="outlined" startIcon={<Add />}>
        Add Creator
      </Button>
    );

    // Clean up
    return () => {
      setHeaderTitle("");
      setHeaderActions(null);
      setPrimaryAction(null);
      setSideContent(null);
    };
  }, []);

  return (
    <Box
      sx={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 1.5,
        backgroundColor: "#F8F8F8",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Test Layout Page
      </Typography>

      <Typography paragraph>
        This is a test page to demonstrate the app layout functionality.
      </Typography>

      <Button variant="contained" color="primary">
        Sample Button
      </Button>
    </Box>
  );
}
