import React, { useEffect, ReactNode } from "react";
import { Stack, Box } from "@mui/material";
import { LayoutProvider } from "./context/layout-provider";
import { Header } from "./components/header";
import { UserControls } from "./components/user-controls";
import { ContentPanel } from "./components/content-panel";
import { SidePanel } from "./components/side-panel";
import { NavigationSidebar } from "./components/navigator-sidebar";
import { useAuthContext } from "@/auth/hooks";
import { useLayout } from "./context/layout-context";
import { shouldHideSidePanel } from "./config/route-layouts";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: ReactNode;
}
export default function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    console.log("AppLayout rendered");
  });

  const { role } = useAuthContext();

  if (role === "STAFF") {
    return children;
  }

  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  );
}

function AppLayoutContent({ children }: { children: ReactNode }) {
  const { sidebarWidth, plainMode, sideContent } = useLayout();
  const pathname = usePathname();
  const hideSidePanel = shouldHideSidePanel(pathname);

  // Used in Settings page
  if (plainMode) {
    return (
      <Stack
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <NavigationSidebar />
        <Stack sx={{ flex: 1 }}>
          <Stack
            direction="row"
            spacing={1.5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pl={1.5}
            pr={3}
            sx={{
              pt: "1rem",
            }}
          >
            <Header />
            <UserControls />
          </Stack>
          {children}
        </Stack>
      </Stack>
    );
  }

  if (hideSidePanel && !sideContent) {
    return (
      <Stack
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <NavigationSidebar />

        <Stack
          pr={3}
          direction="row"
          spacing={1.5}
          sx={{
            flex: 1,
            overflow: "hidden", // Changed from "scroll" to "hidden"
            minHeight: 0, // Ensures proper flex behavior
          }}
        >
          {/* Vertical 1 */}
          <Stack
            spacing={1.5}
            sx={{
              flex: 1,
              minWidth: 0,
              // overflow: "hidden", // Prevent this stack from scrolling
              // minHeight: 0, // Ensures proper flex behavior
              pt: "1rem",
            }}
          >
            <Stack direction="row" justifyContent="space-between" spacing={3}>
              <Header />
              <UserControls />
            </Stack>
            <ContentPanel>{children}</ContentPanel>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <NavigationSidebar />

      <Stack
        pr={3}
        direction="row"
        spacing={1.5}
        sx={{
          flex: 1,
          overflow: "hidden", // Changed from "scroll" to "hidden"
          minHeight: 0, // Ensures proper flex behavior
        }}
      >
        {/* Vertical 1 */}
        <Stack
          spacing={1.5}
          sx={{
            flex: 1,
            minWidth: 0,
            // overflow: "hidden", // Prevent this stack from scrolling
            pt: "1rem",
            minHeight: 0, // Ensures proper flex behavior
          }}
        >
          <Header />
          <ContentPanel>{children}</ContentPanel>
        </Stack>

        {/* Vertical 2 */}
        <Stack
          spacing={1.5}
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            overflow: "hidden", // Prevent this stack from scrolling
            minHeight: 0, // Ensures proper flex behavior
            pt: "1rem",
          }}
        >
          <UserControls />
          <SidePanel />
        </Stack>
      </Stack>
    </Stack>
  );
}
