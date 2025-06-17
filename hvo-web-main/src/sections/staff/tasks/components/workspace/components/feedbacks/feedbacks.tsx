import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { useGetStaffFeedbacks } from "@/use-queries/feedback";
import { Button, IconButton, Stack, SxProps, Typography } from "@mui/material";
import FeedbackItem from "./components/feedback-item";
import SvgColor from "@/components/svg-color";
import FeedbacksEmpty from "./components/feedbacks-empty";

export default function Feedbacks({ sx }: { sx?: SxProps }) {
  const { taskId, isTaskLoading } = useStaffContext();
  const { feedbacks, isLoading, error, refetch } = useGetStaffFeedbacks({
    taskId,
  });

  const showEmptyFeedbacks =
    !isLoading && !isTaskLoading && feedbacks && feedbacks?.length === 0;

  return (
    <Stack
      sx={{
        minWidth: 320,
        width: 320,
        flexShrink: 0,
        backgroundColor: "common.background",
        borderRadius: "24px",
        ...sx,
      }}
      p={1.5}
      mb={1.5}
      spacing={1.25}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <SvgColor src="/assets/icons/comment-bubble.svg" />
          <Typography fontSize={18} fontWeight={600} color="primary.surface">
            Feedbacks
          </Typography>
        </Stack>
        {/* <IconButton
          onClick={() => refetch()}
          sx={{
            width: 32,
            height: 32,
            p: 0,
            backgroundColor: "common.white",
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
          }}
        >
          <SvgColor src="/assets/icons/clock.svg" />
        </IconButton> */}
      </Stack>

      {/* Feedback items */}
      <Stack spacing={1.25}>
        {!isTaskLoading &&
          feedbacks?.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}
      </Stack>

      {/* Empty state */}
      {showEmptyFeedbacks && <FeedbacksEmpty />}
    </Stack>
  );
}
