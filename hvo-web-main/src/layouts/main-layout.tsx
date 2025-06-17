"use client";
import Box from "@mui/material/Box";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* <Header /> */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 12 },
        }}
      >
        {children}
      </Box>

      {/* <Footer /> */}
    </Box>
  );
}
