import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { hideScroll } from "@/theme/css";

import Logo from "src/components/logo";
import { NavSectionMini } from "src/components/nav-section";

import { NAV } from "../config-layout";
import { useNavData } from "./config-navigation";
import NavToggleButton from "../common/nav-toggle-button";

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData(true);

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: "fixed",
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: "auto", my: 2, width: 30, height: 30 }} />

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: "Admin", // user?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
