import { useBoolean } from "@/hooks/use-boolean";
import { GiveFeedbackModal } from "./give-feedback-modal";
import { Button, Stack } from "@mui/material";
import SvgColor from "@/components/svg-color";
import { ShareModal } from "./share-modal";

export default function HeaderActions() {
  const isFeedbackModalOpen = useBoolean();
  const isShareModalOpen = useBoolean();

  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      {/* Buttons */}
      <Button
        variant="outlined"
        onClick={isFeedbackModalOpen.onTrue}
        size="large"
        startIcon={<SvgColor src="/assets/icons/leave-feedback.svg" />}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
        }}
      >
        Feedback
      </Button>
      <Button
        variant="outlined"
        onClick={isShareModalOpen.onTrue}
        size="large"
        startIcon={<SvgColor src="/assets/icons/share.svg" />}
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
        }}
      >
        Share
      </Button>

      {/* Modals */}
      <GiveFeedbackModal
        open={isFeedbackModalOpen.value}
        onClose={isFeedbackModalOpen.onFalse}
      />
      <ShareModal
        open={isShareModalOpen.value}
        onClose={isShareModalOpen.onFalse}
      />
    </Stack>
  );
}
