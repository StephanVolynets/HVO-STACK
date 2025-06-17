import SvgColor from "@/components/svg-color";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import Feedback from "./components/feedback";
import { useGetVideoFeedbacks } from "@/use-queries/feedback";

export default function VideoFeedbacks() {
  const { feedbacks, isLoading } = useGetVideoFeedbacks();

  return (
    <Stack spacing={1.25} sx={{ height: "100%" }}>
      <Stack direction="row" spacing={0.5} py={0.5}>
        <SvgColor src="/assets/icons/comment-bubble.svg" />
        <Typography
          variant="bodyLargeStrong"
          color="primary.surface"
          sx={{ opacity: 0.75 }}
        >
          Feedbacks
        </Typography>
      </Stack>

      {!isLoading && feedbacks?.length === 0 && (
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box
            component="img"
            src="/assets/images/comment-bubble.png"
            width={92}
            height={92}
          />
          <Typography variant="bodySmall">All quiet for now.</Typography>
          <Typography variant="bodySmall">Feedback will show here</Typography>
        </Stack>
      )}

      <Stack
        spacing={1.25}
        sx={{
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {isLoading && (
          <>
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                height={64}
                sx={{
                  borderRadius: "12px",
                  bgcolor: "rgba(0, 0, 0, 0.05)",
                }}
              />
            ))}
          </>
        )}

        {!isLoading &&
          feedbacks?.map((feedback) => (
            <Feedback key={feedback.id} feedback={feedback} />
          ))}
      </Stack>
    </Stack>
  );
}
