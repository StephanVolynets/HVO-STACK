"use client";
import { useSettingsContext } from "@/components/settings";
import { Box, Container, Stack } from "@mui/material";
import { SidePanel } from "./components/side-panel";
import { Workspace } from "./components/workspace";
import { StaffContextProvider } from "./contexts/staff-context";

export default function TasksView() {
  return (
    <StaffContextProvider>
      <Stack
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <SidePanel />
        <Workspace />
      </Stack>
    </StaffContextProvider>
  );
}
