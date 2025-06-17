import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Typography, Button } from "@mui/material";
import { ApproveFeedbackDTO, approveFeedbackDTOSchema, AudioDubPhase } from "hvo-shared";
import { useForm } from "react-hook-form";
import { RHFFormError, RHFRadioGroup } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import Iconify from "@/components/iconify";
import { z } from "zod";
import { useSnackbar } from "notistack";
import { FormError } from "@/components/form/form-error";
import { useApproveFeedback } from "@/use-queries/feedback";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";

const defaultValues = {
  phase: undefined,
};

type Props = {
  open: boolean;
  onClose: () => void;
  feedbackId: number;
};

const OPTIONS = [
  { value: AudioDubPhase.TRANSCRIPTION, label: "Transcription" },
  { value: AudioDubPhase.TRANSLATION, label: "Translation" },
  { value: AudioDubPhase.VOICE_OVER, label: "Voice Over" },
  { value: AudioDubPhase.AUDIO_ENGINEERING, label: "Audio Engineering" },
];
export default function ApproveFeedbackModal({ open, onClose, feedbackId }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<ApproveFeedbackDTO>({
    resolver: zodResolver(approveFeedbackDTOSchema),
    defaultValues,
  });

  const selectedPhase = methods.watch("phase");

  const { mutate, isLoading } = useApproveFeedback(feedbackId);

  const handleSubmit = methods.handleSubmit(async (data: ApproveFeedbackDTO) => {
    mutate(data, {
      onError: () => {
        methods.setError("phase", {
          type: "manual",
          message: "Failed to approve feedback. Please try again.",
        });
        enqueueSnackbar("Unable to create creator!", { variant: "error" });
      },
      onSuccess: () => {
        methods.reset(defaultValues);
        enqueueSnackbar("Creator added successfully!", { variant: "success" });
        onClose();
      },
    });
  });

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit}>
        <Stack
          sx={{
            width: { xs: "90vw", sm: "70vw", md: 425 },
            display: "flex",
          }}
          p={4}
          spacing={3}
        >
          <Typography variant="h3" alignSelf="center">
            Select Return Phase
          </Typography>

          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Select the phase to which the audio dub should be reverted.
            </Typography>

            <RHFRadioGroup
              name="phase"
              options={OPTIONS}
              spacing={0.1}
              sx={{
                "& .MuiFormControlLabel-root": {
                  my: 1,
                  ml: 0.5,
                },
              }}
            />

            <RHFFormError name="phase" />

            <Stack spacing={1.25}>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onClose}
                  startIcon={<Iconify icon="material-symbols:close" />}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  startIcon={<Iconify icon="material-symbols:check" />}
                  disabled={!selectedPhase || isLoading} // Disable if no phase is selected
                >
                  {isLoading ? "Approving..." : "Confirm"}
                </Button>
              </Stack>
              <Typography variant="caption" px={0.5} textAlign="center">
                By confirming, you will approve the feedback and revert the audio dub to the selected phase.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </FormProvider>
    </Modal>
  );
}
