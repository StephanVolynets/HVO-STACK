import {
  Box,
  Popover,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
} from "@mui/material";
import { StaffVideoDTO } from "hvo-shared";
import { useState } from "react";

interface SelectedVideosBadgeProps {
  videoTitles: string[];
}

// Custom styled tooltip to show video list
const VideosTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: "0px 4px 16px 0px rgba(38, 38, 38, 0.1)",
    padding: theme.spacing(1.5),
    borderRadius: 12,
    maxWidth: 400,
    maxHeight: 400,
    overflow: "auto",
  },
}));

export default function SelectedVideosBadge({
  videoTitles,
}: SelectedVideosBadgeProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          backgroundColor: "common.white",
          border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
          borderRadius: "100px",
          px: 3,
          py: 1.5,
          cursor: "default",
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
        }}
      >
        <Typography
          fontSize={18}
          fontWeight={400}
          color="primary.surface"
          sx={{ opacity: 0.7 }}
        >
          For {videoTitles.length} Selected Videos
        </Typography>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMouseLeave}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableRestoreFocus
        sx={{
          pointerEvents: "none",
          "& .MuiPopover-paper": {
            overflowY: "auto",
            mt: 1,
            boxShadow: "0px 4px 16px 0px rgba(38, 38, 38, 0.1)",
            borderRadius: 2,
            maxHeight: 300,
            width: 350,
            p: 1.5,
          },
        }}
      >
        <Typography
          variant="subtitle1"
          color="primary.surface"
          fontWeight={500}
          mb={1}
        >
          Selected Videos:
        </Typography>
        <Stack spacing={1}>
          {videoTitles.map((videoTitle) => (
            <Box
              key={videoTitle}
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Typography
                noWrap
                title={videoTitle}
                fontWeight={400}
                fontSize={14}
              >
                {videoTitle}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
