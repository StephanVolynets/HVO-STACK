import SvgColor from "@/components/svg-color";
import { useGetVideoPreview } from "@/use-queries/video";
import { Box, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import { useSelectedLanguage } from "../hooks/use-selected-language";

export default function VideoDescription() {
  const { video } = useGetVideoPreview();
  const [copied, setCopied] = useState(false);
  const { selectedLanguage } = useSelectedLanguage();

  const getSelectedDescription = () => {
    if (!video) return "";

    // If selectedLanguage is -1, use the main video description
    if (selectedLanguage === -1) {
      return video?.description || "";
    }

    // If selectedLanguage exists and is valid, use the localized description
    if (selectedLanguage) {
      return (
        video.descriptions.findLast((d) => d.languageId === selectedLanguage)
          ?.description || ""
      );
    }

    return "";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSelectedDescription());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        borderRadius: "24px",
        backgroundColor: "common.white",
        boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box
        px={2.5}
        py={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" color="primary.surface">
          Description
        </Typography>
        <Tooltip title={copied ? "Copied!" : ""} placement="top">
          <IconButton onClick={handleCopy}>
            <SvgColor
              src={
                copied
                  ? "/assets/icons/check-circle.svg"
                  : "/assets/icons/copy.svg"
              }
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box p={3} pt={0}>
        <Typography
          variant="bodySmall"
          sx={{
            whiteSpace: "pre-line",
          }}
        >
          {getSelectedDescription()}
        </Typography>
      </Box>
    </Stack>
  );
}
