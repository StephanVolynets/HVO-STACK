import { FlagEmoji } from "@/components/flag-emoji";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { FeedbackDTO } from "hvo-shared";
import { format } from "date-fns";
import Iconify from "@/components/iconify";
import {
  useRejectFeedback,
  useRejectFeedbackIssue,
} from "@/use-queries/feedback";
import { toTitleCase } from "@/utils/strings-formatter";

interface Props {
  feedback: FeedbackDTO;
  selectedIssueIndex: number;
  onIssueClick: (feedbackId: number, issueIndex: number) => void;
  formatTimestamp: (seconds: number) => string;
  onFeedbackApprove: (feedbackId: number) => void;
}

export function FeedbackItem({
  feedback,
  selectedIssueIndex,
  onIssueClick,
  formatTimestamp,
  onFeedbackApprove,
}: Props) {
  const { mutate: rejectIssue } = useRejectFeedbackIssue(feedback.id);

  const { mutate: rejectFeedback, isLoading } = useRejectFeedback();

  const handleFeedbackIssueDelete = (issueId: number) => {
    rejectIssue(issueId);
  };

  return (
    <Box
      sx={{
        backgroundColor: "common.white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        p: 1.5,
        pt: 1,
        pr: 1,
      }}
    >
      <Stack spacing={1}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontSize={20} fontWeight={700}>
              Feedback #{feedback.id}
            </Typography>
            <Typography fontSize={20} fontWeight={700}>
              •
            </Typography>
            {/* Language */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                borderRadius: "100px",
                border: (theme) =>
                  `1px solid ${theme.palette.common.mainBorder}`,
                backgroundColor: "#FFF",
                px: 2,
                py: 1,
                height: "40px",
              }}
            >
              <FlagEmoji countryCode={feedback.language.code} maxHeight={20} />
              <Typography fontSize={16} fontWeight={600}>
                {feedback.language.name}
              </Typography>
            </Stack>
            {/* <Typography color="text.secondary" sx={{ fontSize: 20 }}>
              •
            </Typography> */}
            {/* Timestamp */}
            <Stack
              sx={{
                borderRadius: "100px",
                border: (theme) =>
                  `1px solid ${theme.palette.common.mainBorder}`,
                backgroundColor: "#FFF",
                px: 2,
                py: 1,
                height: "40px",
              }}
            >
              <Typography fontSize={16} fontWeight={600}>
                {format(new Date(feedback.createdAt), "dd/MM/yyyy - HH:mm a")}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            {
              feedback.status === "NEW" ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => rejectFeedback(feedback.id)}
                    disabled={isLoading}
                    sx={{
                      px: 2,
                      py: 1,
                      height: 36,
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => onFeedbackApprove(feedback.id)}
                    disabled={isLoading}
                    sx={{
                      px: 2,
                      py: 1,
                      height: 36,
                      backgroundColor: "red.surface1",
                      color: "red.onSurface",
                      borderColor: "red.border",
                      "&:hover": {
                        backgroundColor: "red.surface1",
                        borderColor: "red.border",
                        opacity: 0.8,
                      },
                    }}
                  >
                    Discard
                  </Button>
                </>
              ) : null
              // <Chip
              //   label={toTitleCase(feedback.status)}
              //   color={
              //     feedback.status === "IN_PROGRESS"
              //       ? "primary"
              //       : feedback.status === "RESOLVED"
              //       ? "success"
              //       : "error"
              //   }
              //   size="small"
              // />
            }
          </Stack>
        </Stack>

        {/* Timestamps */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              {feedback.issues.map((issue, index) => (
                <Chip
                  key={issue.id}
                  // icon={<Iconify icon="bxs:time-five" color="#637481" />}
                  label={`${formatTimestamp(
                    issue.startTimestamp
                  )} - ${formatTimestamp(issue.endTimestamp)}`}
                  onClick={() => onIssueClick(feedback.id, index)}
                  onDelete={
                    feedback.status === "NEW"
                      ? () => handleFeedbackIssueDelete?.(issue.id)
                      : undefined
                  } // Conditionally allow delete
                  deleteIcon={
                    feedback.status === "NEW" ? (
                      <Iconify icon="iconamoon:close" color="#637481" />
                    ) : undefined
                  }
                  sx={{
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 400,
                    border: (theme) =>
                      `1px solid ${theme.palette.common.mainBorder}`,
                    backgroundColor:
                      selectedIssueIndex === index ? "#FFF" : "#F2F2F2",
                    color:
                      selectedIssueIndex === index
                        ? "primary.main"
                        : "text.secondary",
                    "&:hover": {
                      backgroundColor: "#E5E5E5",
                      color: "primary.main",
                    },
                  }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Description */}
          <Typography variant="bodySmall">
            {feedback.issues[selectedIssueIndex]?.description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
