"use client";
import Box from "@mui/material/Box";

type Props = {
  children: React.ReactNode;
};

export default function ContentLayout({ children }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        borderRadius: "36px",
        backgroundColor: (theme) => theme.palette.common.white,
        boxShadow: "0px 4px 16px 0px rgba(38, 38, 38, 0.05)",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
