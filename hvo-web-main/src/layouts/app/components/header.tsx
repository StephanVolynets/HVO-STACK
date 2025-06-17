import React, { memo, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import { useLayout } from "../context/layout-context";

function HeaderComponent() {
  const { headerTitle, headerActions, plainMode } = useLayout();

  useEffect(() => {
    console.log("[Performance] Header rendered");
  });

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "common.green",
        height: "56px",
        // minHeight: "100px",
        // pt: !plainMode ? 3 : 0,
        // pt: !plainMode ? "1rem" : 0,
        // flex: 1,
        // width: "100%",
      }}
    >
      <Box
        sx={{
          // Fix text overflow (to allow text to be cut off)
          flexGrow: 1,
          minWidth: 0, // This is crucial for text-overflow to work
          display: "flex",
          alignItems: "center",
        }}
      >
        {headerTitle}
      </Box>
      <Box
        sx={{
          // Fix actions shrink due to long header title
          flexShrink: 0,
        }}
      >
        {headerActions}
      </Box>
    </Stack>
  );
}

export const Header = memo(HeaderComponent);
