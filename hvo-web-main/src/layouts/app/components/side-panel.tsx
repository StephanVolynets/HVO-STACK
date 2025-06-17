import { Box } from "@mui/material";
import { memo } from "react";
import { useLayout } from "../context/layout-context";

function SidePanelComponent() {
  const { sideContent } = useLayout();

  console.log("[Performance] SidePanel rendered");

  return (
    <Box
      sx={{
        flex: 1,
        padding: 1.5,
        mb: 1.5,
        borderRadius: "24px",
        backgroundColor: "#F8F8F8",
        overflow: "auto", // Make SidePanel container scrollable,
        minHeight: 0, // Ensures proper flex behavior
      }}
    >
      {sideContent}
    </Box>
  );
}

export const SidePanel = memo(SidePanelComponent);
