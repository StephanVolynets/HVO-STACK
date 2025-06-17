import SvgColor from "@/components/svg-color";
import { useGetVideoPreview } from "@/use-queries/video";
import {
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

export default function VideoTitle() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { video } = useGetVideoPreview();
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyTitle = () => {
    navigator.clipboard.writeText(video?.title || "");
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Typography
        variant="h2"
        fontWeight={700}
        color="common.surfaceVariant"
        sx={{
          flexWrap: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap", // Add this to prevent wrapping
          maxWidth: "100%", // Ensure it takes full width of container
        }}
      >
        {video?.title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip
          title={copiedLink ? "Link copied!" : "Copy link"}
          placement="top"
        >
          {isMobile ? (
            <IconButton onClick={handleCopyLink}>
              <SvgColor
                src={
                  copiedLink
                    ? "/assets/icons/check-circle.svg"
                    : "/assets/icons/link.svg"
                }
              />
            </IconButton>
          ) : (
            <Button
              size="large"
              startIcon={<SvgColor src="/assets/icons/link.svg" />}
              onClick={handleCopyLink}
              sx={{
                maxWidth: "100%",
                whiteSpace: "normal",
              }}
            >
              <Typography noWrap>Copy link</Typography>
            </Button>
          )}
        </Tooltip>
        <Tooltip
          title={copiedTitle ? "Title copied!" : "Copy title"}
          placement="top"
        >
          <IconButton onClick={handleCopyTitle}>
            <SvgColor
              src={
                copiedTitle
                  ? "/assets/icons/check-circle.svg"
                  : "/assets/icons/copy.svg"
              }
            />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
