"use client";
import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLayout } from "@/layouts/app/context/layout-context";
import { Notifications } from "@/components/notifications";
import { useAuthContext } from "@/auth/hooks";
import { AddStaffPrimaryAction } from "../inbox/components/add-staff-primary-action";
import { StaffFilters } from "./components/filters";
import {
  StaffContextProvider,
  useStaffContext,
} from "./contexts/staff-context";
import { StaffPanel } from "./components/panel";
import { useGetStaffCount } from "@/use-queries/staff";

function StaffViewContent() {
  const { profile } = useAuthContext();
  const { setHeaderTitle, setPrimaryAction } = useLayout();
  const { count } = useGetStaffCount();

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
          Staff
        </Typography>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
          }}
        >
          {count}
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
  }, [count, setHeaderTitle, setPrimaryAction]);

  return (
    <Stack
      sx={{
        display: "flex",
        overflow: "hidden",
        flexDirection: "column",
        // height: "calc(100vh - 124px)",
        height: "calc(100vh - 110px)",
      }}
      spacing={1.5}
    >
      <StaffFilters />
      <StaffPanel />
    </Stack>
  );
}

export default function StaffView() {
  return (
    <StaffContextProvider>
      <StaffViewContent />
    </StaffContextProvider>
  );
}
