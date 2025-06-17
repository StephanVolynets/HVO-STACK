// src/layouts/app-layout/components/navigation-sidebar.tsx
import React, { memo, useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import { m, AnimatePresence } from "framer-motion";
import NavigatorFooter from "./components/navigator-footer";
import { useNavData } from "./config-navigation";
import NavButton from "./components/nav-button";

function NavigationSidebarComponent() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log("[Performance] NavigationSidebar rendered");
  });

  const navData = useNavData();

  return (
    <Box sx={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
      <m.div
        initial={{ width: "80px" }}
        animate={{ width: isExpanded ? "320px" : "80px" }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          // ease: [0.25, 0.1, 0.25, 1.0],
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Stack
          sx={{
            justifyContent: "space-between",
            height: "100%",
            width: "100%", // Use 100% width to follow parent's animated width
            overflow: "hidden",
          }}
        >
          <Stack
            spacing={0.5}
            sx={{
              p: 1.5,
              pt: 3,
            }}
          >
            {navData.items.map((item) => (
              <NavButton key={item.title} item={item} isExpanded={isExpanded} />
            ))}
          </Stack>

          <NavigatorFooter isExpanded={isExpanded} />
        </Stack>
      </m.div>
    </Box>
  );
}

export const NavigationSidebar = memo(NavigationSidebarComponent);
