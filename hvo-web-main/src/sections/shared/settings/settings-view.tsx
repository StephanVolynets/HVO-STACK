"use client";

import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "src/routes/hooks";
import { useAuthContext } from "@/auth/hooks";
import Iconify from "@/components/iconify";
import AccountSettings from "./components/account-settings";
import { AssistantsSettings } from "./components/assistants-settings";
import { useLayout } from "@/layouts/app/context/layout-context";
import { useEffect } from "react";
import AddCreatorPrimaryAction from "@/sections/admin/shared/components/add-creator-primary-action";
import { Role } from "hvo-shared";
import { UserRole } from "@/auth/types";
import SvgColor from "@/components/svg-color";
import { IntegrationSettings } from "./components/integrations-settings";
import { LibraryPrimaryAction } from "@/sections/creator/library/components/library-primary-action";

const COMMON_TABS = [
  {
    value: "account",
    label: "Account Settings",
    icon: <SvgColor src="/assets/icons/person.svg" />,
    component: <AccountSettings />,
  },
];

const ADVANCED_TABS = [
  ...COMMON_TABS,
  {
    value: "assistants",
    label: "Assistants",
    icon: <SvgColor src="/assets/icons/group.svg" />,
    component: <AssistantsSettings />,
  },
  {
    value: "integrations",
    label: "Integrations",
    icon: <SvgColor src="/assets/icons/integrations.svg" />,
    component: <IntegrationSettings />,
  },
];

const getPrimaryActionForRole = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return <AddCreatorPrimaryAction />;
    case "CREATOR":
      return <LibraryPrimaryAction />;
    default:
      return null;
  }
};

export default function SettingsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role } = useAuthContext();
  const { setPlainMode, setHeaderTitle, setPrimaryAction } = useLayout();

  // Initialize layout
  useEffect(() => {
    setPlainMode(true);

    setHeaderTitle(
      <Typography
        variant="h1"
        color="common.surfaceVariant"
        sx={{ opacity: 0.75, fontSize: "2rem", lineHeight: "2.5rem" }}
      >
        Settings
      </Typography>
    );
    setPrimaryAction(role ? getPrimaryActionForRole(role) : null);

    return () => {
      setPlainMode(false);
      setHeaderTitle(null);
      setPrimaryAction(null);
    };
  }, [role]);

  // Determine available tabs based on role
  const TABS =
    role === "ADMIN" || role === "VENDOR" || role === "CREATOR"
      ? ADVANCED_TABS
      : COMMON_TABS;

  // Get current tab from query params, default to 'account' if not found
  const currentTab = searchParams?.get("tab") || "account";

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    console.log("newValue", newValue);
    // Create new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams);
    // router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.push(`${pathname}?tab=${newValue}`, { scroll: false });
  };

  return (
    <Stack direction="row" sx={{ minHeight: 1, pr: 3 }}>
      {/* Tabs */}
      <Box
        width={256}
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          p: 1.5,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          orientation="vertical"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            borderRight: 0,
            "& .MuiTab-root": {
              width: "100%",
              justifyContent: "flex-start",
              px: 2,
              py: 1,
              minHeight: 48,
              textTransform: "none",
              borderRadius: "4px",
              "&.Mui-selected": {
                bgcolor: "#E9E9E9",
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              sx={{
                px: "20px!important",
                py: "12px!important",
                borderRadius: "100px!important",
                "&.Mui-selected": {
                  backgroundColor: "rgba(38, 38, 38, 0.10)!important",
                },
              }}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  {/* <Iconify icon={tab.icon} width={24} /> */}
                  {tab.icon}
                  <Typography variant="labelLarge">{tab.label}</Typography>
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Box>
      {/* Content Area */}
      <Box
        flex={1}
        sx={{
          m: 1.5,
          mb: 0,
          bgcolor: "common.background",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          minHeight: 0,
          overflow: "auto",
        }}
      >
        {TABS.find((tab) => tab.value === currentTab)?.component}
      </Box>
    </Stack>
  );
}
