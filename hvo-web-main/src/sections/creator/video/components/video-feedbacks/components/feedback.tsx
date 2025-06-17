import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { format } from "date-fns";
import { FeedbackDTO } from "hvo-shared";
import Iconify from "@/components/iconify";
import { FlagEmoji } from "@/components/flag-emoji";
import SvgColor from "@/components/svg-color";
import { Collapse } from "@mui/material";

interface FeedbackProps {
  feedback: FeedbackDTO;
}

export default function Feedback({ feedback }: FeedbackProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 2,
        pb: isExpanded ? 2 : 0.5, // Collapse adds 12px height for hidden elements (12px + 4px = 16px)
        borderRadius: "12px",
        backgroundColor: "common.white",
        transition: "padding-bottom 0.3s ease", // Smooth transition for padding
      }}
    >
      {/* FeedbackHeader */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor:
                feedback.status === "NEW"
                  ? "success.main"
                  : feedback.status === "IN_PROGRESS"
                  ? "#4285F4"
                  : feedback.status === "RESOLVED"
                  ? "success.main"
                  : "error.main",
            }}
          />
          <Typography
            sx={{ fontSize: 18, fontWeight: 500, color: "common.black" }}
          >
            {format(new Date(feedback.createdAt), "MMM d, yyyy • HH:mm •")}
          </Typography>
          <FlagEmoji countryCode={feedback.language.code} maxHeight={32} />
        </Stack>
        <IconButton
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            width: 32,
            height: 32,
            backgroundColor: "common.white",
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            color: "common.black",
            // Transform icon
            transform: isExpanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <Iconify icon="eva:chevron-down-fill" width={20} />
        </IconButton>
      </Stack>

      {/* Feedback Issues */}
      <Collapse
        in={isExpanded}
        timeout={300}
        sx={{
          marginTop: "0 !important",
          marginBottom: "0 !important",
          "& .MuiCollapse-wrapper": {
            marginTop: "0 !important",
            marginBottom: "0 !important",
          },
        }}
      >
        {feedback.issues.length > 0 && (
          <Stack spacing={1.5}>
            {feedback.issues.map((issue, index) => (
              <Stack
                key={index}
                spacing={0.5}
                sx={{
                  backgroundColor: "common.background",
                  borderRadius: "8px",
                  p: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <SvgColor src="/assets/icons/pace.svg" color="common.black" />
                  <Typography variant="bodyRegular" color="common.black">
                    {formatTimestamp(issue.startTimestamp)} -{" "}
                    {formatTimestamp(issue.endTimestamp)}
                  </Typography>
                </Stack>

                <Typography variant="bodyRegular" color="common.black">
                  {issue.description}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Collapse>
    </Stack>
  );
}
