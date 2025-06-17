import { Box, Stack, Typography, Button } from "@mui/material";
import { useState } from "react";
import { FeedbackItem } from "./components/feedback-item";
import ApproveFeedbackModal from "./components/approve-feedback-modal";
import { useBoolean } from "@/hooks/use-boolean";
import { useGetVendorFeedbacks } from "@/use-queries/feedback";
import { LoadingState } from "@/components/custom-loading";

export default function FeedbacksContent() {
  const isModalOpen = useBoolean();
  const { feedbacks, isLoading, error, refetch } = useGetVendorFeedbacks();
  const [selectedIssues, setSelectedIssues] = useState<Record<number, number>>({});
  const [clickedFeedbackId, setClickedFeedbackId] = useState<number>();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center" spacing={2}>
        <Typography color="error">Failed to load feedbacks</Typography>
        <Button variant="outlined" onClick={() => refetch()}>
          Try Again
        </Button>
      </Stack>
    );
  }

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleIssueClick = (feedbackId: number, issueIndex: number) => {
    setSelectedIssues((prev) => ({
      ...prev,
      [feedbackId]: issueIndex,
    }));
  };

  return (
    <Stack flex={1} sx={{ backgroundColor: "transparent" }} minHeight={0}>
      <Stack flex={1} p={2} spacing={2} minHeight={0} maxHeight={460} sx={{ overflow: "scroll" }}>
        {feedbacks?.map((feedback) => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            selectedIssueIndex={selectedIssues[feedback.id] || 0}
            onIssueClick={handleIssueClick}
            formatTimestamp={formatTimestamp}
            onFeedbackApprove={(feedbackId) => {
              setClickedFeedbackId(feedbackId);
              isModalOpen.onTrue();
            }}
          />
        ))}
      </Stack>

      <ApproveFeedbackModal
        open={isModalOpen.value}
        onClose={() => {
          isModalOpen.onFalse();
          // setSelectedFeedback(null);
        }}
        feedbackId={clickedFeedbackId || -1}
      />
    </Stack>
  );
}
