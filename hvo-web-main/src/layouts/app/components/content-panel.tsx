import { Box } from "@mui/material";
import { memo } from "react";

interface ContentPanelProps {
  children: React.ReactNode;
}

function ContentPanelComponent({ children }: ContentPanelProps) {
  console.log("[Performance] ContentPanel rendered");

  return (
    <Box
      sx={{
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 1.5,
        backgroundColor: "#F8F8F8",
        overflow: "auto", // Make ContentPanel container scrollable
        minHeight: 0, // Ensures proper flex behavior
      }}
    >
      {children}
    </Box>
  );
}

export const ContentPanel = memo(ContentPanelComponent);
