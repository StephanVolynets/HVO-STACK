import { FlagEmoji } from "@/components/flag-emoji";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { FeedbackDTO } from "hvo-shared";
import { format } from "date-fns";
import Iconify from "@/components/iconify";
import { useRejectFeedback, useRejectFeedbackIssue } from "@/use-queries/feedback";
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
      }}
    >
      <Stack spacing={2} p={2}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Feedback #{feedback.id}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 20 }}>
              •
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <FlagEmoji countryCode={feedback.language.code} maxHeight={20} />
              <Typography>{feedback.language.name}</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ fontSize: 20 }}>
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(feedback.createdAt), "dd/MM/yyyy - HH:mm a")}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            {feedback.status === "NEW" ? (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Iconify icon="material-symbols:close" />}
                  onClick={() => rejectFeedback(feedback.id)}
                  disabled={isLoading}
                  sx={{ pr: 2, pl: 1.5 }}
                >
                  Discard
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Iconify icon="material-symbols:check" />}
                  onClick={() => onFeedbackApprove(feedback.id)}
                  disabled={isLoading}
                  sx={{ pr: 2, pl: 1.5 }}
                >
                  Approve
                </Button>
              </>
            ) : (
              <Chip
                label={toTitleCase(feedback.status)}
                color={
                  feedback.status === "IN_PROGRESS" ? "primary" : feedback.status === "RESOLVED" ? "success" : "error"
                }
                size="small"
              />
            )}
          </Stack>
        </Stack>

        {/* Timestamps */}
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {feedback.issues.map((issue, index) => (
                <Chip
                  key={issue.id}
                  icon={<Iconify icon="bxs:time-five" color="#637481" />}
                  label={`${formatTimestamp(issue.startTimestamp)} - ${formatTimestamp(issue.endTimestamp)}`}
                  onClick={() => onIssueClick(feedback.id, index)}
                  onDelete={feedback.status === "NEW" ? () => handleFeedbackIssueDelete?.(issue.id) : undefined} // Conditionally allow delete
                  deleteIcon={
                    feedback.status === "NEW" ? <Iconify icon="iconamoon:close" color="#637481" /> : undefined
                  }
                  sx={{
                    cursor: "pointer",
                    backgroundColor: selectedIssueIndex === index ? "primary.lighter" : "grey.100",
                    color: selectedIssueIndex === index ? "primary.main" : "text.secondary",
                    "&:hover": {
                      backgroundColor: "primary.lighter",
                      color: "primary.main",
                    },
                  }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Description */}
          <Typography variant="body2" sx={{ pl: 1 }}>
            {feedback.issues[selectedIssueIndex]?.description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
