"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Stack, useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";
import { isExcludedRoute } from "./desktop-only-guard-config";

interface Props {
  children: ReactNode;
}

export default function DesktopOnlyGuard({ children }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(1024));
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isExcluded = isExcludedRoute(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  // Skip desktop check for excluded routes
  if (isExcluded) {
    return <>{children}</>;
  }

  if (!isDesktop) {
    return (
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Box
            component="img"
            src="/assets/images/devices-other.png"
            sx={{
              width: { xs: 128, sm: 192 },
              height: { xs: 128, sm: 192 },
            }}
          />
          <Stack spacing={{ xs: 0.5, sm: 0 }} alignItems="center">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              spacing={{ xs: 0.5, sm: 1 }}
              justifyContent="center"
            >
              <Typography
                fontSize={{ xs: 28, sm: 32 }}
                fontWeight={500}
                color="#333333"
                textAlign="center"
              >
                The System is Currently
              </Typography>
              <Box
                component="span"
                px={{ xs: 2, sm: 2.5 }}
                py={1}
                mx={{ xs: 0, sm: 1.25 }}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "rgba(38, 38, 38, 0.05)",
                  border: (theme) =>
                    `1px solid ${theme.palette.common.mainBorder}`,
                  color: "rgba(51, 51, 51, 0.7)",
                }}
              >
                <Typography
                  fontSize={{ xs: 28, sm: 32 }}
                  fontWeight={500}
                  textAlign="center"
                  sx={{ opacity: 0.7 }}
                >
                  Desktop Only
                </Typography>
              </Box>
            </Stack>
            <Typography fontSize={18} fontWeight={400} textAlign="center">
              Open on a large screen or enlarge your window if it&apos;s
              shrinked
            </Typography>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return <>{children}</>;
}
