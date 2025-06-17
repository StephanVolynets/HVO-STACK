import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  variant: "box" | "youtube" | "sonix";
}

export default function IntegrationsItem({ variant }: Props) {
  const [status, setStatus] = useState<"active" | "inactive" | "checking">(
    "checking"
  );
  const [lastChecked, setLastChecked] = useState<string>("");

  const icon = {
    box: "/assets/images/settings-integrations/box.png",
    youtube: "/assets/images/settings-integrations/youtube.png",
    sonix: "/assets/images/settings-integrations/sonix.png",
  };

  const title = {
    box: "Box.com API",
    youtube: "Youtube API",
    sonix: "Sonix.ai API",
  };

  const apiEndpoints = {
    box: "https://status.box.com/api/v2/status.json",
    youtube: "/api/integrations/youtube/status",
    sonix: "/api/integrations/sonix/status",
  };

  useEffect(() => {
    checkServiceStatus();

    const intervalId = setInterval(checkServiceStatus, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [variant]);

  const checkServiceStatus = async () => {
    try {
      setStatus("checking");
      const response = await axios.get(apiEndpoints[variant]);

      // Handle different API response formats
      if (variant === "box") {
        // Box API returns { status: { indicator: "none" } } when operational
        if (response.data.status?.indicator === "none") {
          setStatus("active");
        } else {
          setStatus("inactive");
        }
      } else {
        // For other APIs (youtube, sonix)
        if (response.data.status === "active" || response.status === 200) {
          setStatus("active");
        } else {
          setStatus("inactive");
        }
      }

      // Update last checked time
      const now = new Date();
      const formattedDate = now
        .toLocaleString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "");
      setLastChecked(formattedDate);
    } catch (error) {
      console.error(`Error checking ${variant} service status:`, error);
      setStatus("inactive");
      // setStatus("active");

      // Still update last checked time even on error
      const now = new Date();
      const formattedDate = now
        .toLocaleString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "");
      setLastChecked(formattedDate);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "green.main";
      case "inactive":
        return "error.main";
      case "checking":
        return "grey.500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "checking":
        return "Checking...";
    }
  };

  return (
    <Stack
      direction="row"
      p={2}
      spacing={1.5}
      flex={1}
      sx={{ backgroundColor: "common.white", borderRadius: "24px" }}
    >
      <Box
        component="img"
        src={icon[variant]}
        sx={{ width: 80, height: 80, objectFit: "contain" }}
      />

      <Stack justifyContent="space-between" width="100%">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{title[variant]}</Typography>
          {/* <Box
            component="button"
            onClick={checkServiceStatus}
            sx={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "primary.main",
              fontSize: "0.75rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Refresh
          </Box> */}
        </Stack>

        <Stack>
          <Typography variant="bodyRegular">
            Status:{" "}
            <Box
              component="span"
              sx={{
                color: getStatusColor(),
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {status === "checking" && (
                <CircularProgress size={14} color="inherit" thickness={5} />
              )}
              {getStatusText()}
            </Box>
          </Typography>
          <Typography variant="bodySmall">
            Last checked: {lastChecked || ""}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
