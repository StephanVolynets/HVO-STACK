import Iconify from "@/components/iconify";
import { Button, Chip, Stack, Typography, Box } from "@mui/material";
import { FeedbackDTO, FeedbackStatus } from "hvo-shared";
import { useState } from "react";

export default function FeedbackItem({ feedback }: { feedback: FeedbackDTO }) {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleIssueClick = (index: number) => {
    setSelectedIssueIndex(index);
  };

  return (
    <Stack
      px={1}
      py="9px"
      sx={{
        borderRadius: "12px",
        backgroundColor: "common.white",
        borderBottom: (theme) =>
          `1px solid ${
            feedback.status === FeedbackStatus.RESOLVED
              ? theme.palette.common.red
              : theme.palette.common.orange
          }`,
      }}
    >
      <Stack spacing={0.5}>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 32,
              background:
                "linear-gradient(-90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              overflowX: "auto",
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                // Chrome, Safari
                display: "none",
              },
              msOverflowStyle: "none", // IE, Edge
              // pb: 0.5, // Compensate for hidden scrollbar space
              // mx: -0.5, // Compensate for padding
              // px: 0.5,
              p: "0.5px",
            }}
          >
            {feedback.issues.map((issue, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "100px",
                  backgroundColor:
                    index === selectedIssueIndex
                      ? "common.background"
                      : "common.white",
                  // border: (theme) => `0.75px solid #FFFFFF`,
                  border: (theme) =>
                    `1px solid ${
                      index === selectedIssueIndex
                        ? theme.palette.primary.main
                        : theme.palette.common.mainBorder
                    }`,
                  pointerEvents: index === selectedIssueIndex ? "none" : "auto",
                  flexShrink: 0, // Prevent button from shrinking
                }}
                onClick={() => handleIssueClick(index)}
              >
                <Typography
                  fontSize={12}
                  fontWeight={600}
                  color="primary.surface"
                  sx={{
                    // opacity: 0.5,
                    // color:
                    //   index === selectedIssueIndex
                    //     ? "common.white"
                    //     : "primary.surface",
                    color: "primary.surface",
                  }}
                >
                  {formatTimestamp(issue.startTimestamp)} -{" "}
                  {formatTimestamp(issue.endTimestamp)}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Box>

        <Typography fontSize={14} fontWeight={400} color="common.black">
          {feedback.issues[selectedIssueIndex].description || "No description"}
        </Typography>
      </Stack>
    </Stack>
  );
}
