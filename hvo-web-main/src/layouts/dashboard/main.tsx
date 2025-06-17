import Box, { BoxProps } from "@mui/material/Box";

import { useResponsive } from "src/hooks/use-responsive";

import { useSettingsContext } from "src/components/settings";

import { NAV, HEADER } from "../config-layout";
import { usePathname } from "src/routes/hooks";

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();

  const pathname = usePathname();
  const isSettings = pathname.includes("/settings");

  const lgUp = useResponsive("up", "lg");

  const isNavHorizontal = settings.themeLayout === "horizontal";

  const isNavMini = settings.themeLayout === "mini";

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          backgroundColor: "common.background",
          minHeight: 1,
          display: "flex",
          flexDirection: "column",
          pt: `${HEADER.H_MOBILE + 24}px`,
          pb: 10,
          ...(lgUp && {
            pt: `${HEADER.H_MOBILE * 2 + 40}px`,
            pb: 15,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "common.background",
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        flexDirection: "column",
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: !isSettings ? 2 : 0,
          py: !isSettings ? `${HEADER.H_DESKTOP + SPACING}px` : 0,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
