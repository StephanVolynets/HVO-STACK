import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  Typography,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  approveAudioDubDTOSchema,
  ApproveDubDto,
  CreateCreatorDTO,
  createCreatorDTOSchema,
  SelectOption,
} from "hvo-shared";
import { FieldErrors, useForm } from "react-hook-form";
import { RHFMultiSelect, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import { scroller } from "react-scroll";
import Iconify from "@/components/iconify";
import { createCreator } from "@/apis/creator";
import { useSnackbar } from "notistack";
import SvgColor from "@/components/svg-color";
import { useMemo, useState } from "react";
import FormError from "@/components/form/form-error/form-error";
import { useGetAllLanguages } from "@/use-queries/common";
import { FlagEmoji } from "@/components/flag-emoji";
import { approveDub } from "@/apis/video";
import { LoadingButton } from "@mui/lab";
import { useSelectedInboxVideo } from "@/sections/admin/inbox/hooks/use-selected-inbox-video";
import { useQueryClient } from "@tanstack/react-query";
import { useInboxFilters } from "@/sections/admin/inbox/hooks/use-inbox-filters";

type Props = {
  open: boolean;
  onClose: () => void;
  dubId: number;
};

export const formDefaultValues: ApproveDubDto = {
  title: "",
  description: "",
};

export default function ApproveDubModal({ open, onClose, dubId }: Props) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedVideo, setSelectedVideo } = useSelectedInboxVideo();
  const queryClient = useQueryClient();
  const { creatorId, searchTerm } = useInboxFilters();

  const methods = useForm<ApproveDubDto>({
    resolver: zodResolver(approveAudioDubDTOSchema),
    defaultValues: formDefaultValues,
  });
  const { handleSubmit, control, reset } = methods;

  const onSubmit = handleSubmit(async (data: ApproveDubDto) => {
    try {
      await approveDub(dubId, data);

      // Update the cache to reflect the approved state
      if (selectedVideo) {
        const updatedVideo = {
          ...selectedVideo,
          audioDubs: selectedVideo.audioDubs.map((dub) =>
            dub.id === dubId ? { ...dub, approved: true } : dub
          ),
        };
        setSelectedVideo(updatedVideo);
      }

      // Invalidate the videos query to ensure fresh data on refetch
      queryClient.invalidateQueries({
        queryKey: ["inbox/videos", creatorId, searchTerm],
      });

      enqueueSnackbar("Audio dub approved!", { variant: "success" });

      reset(formDefaultValues);
      onClose();
    } catch (error) {
      // setErrorMessage(error.AxiosError?.response?.data?.message);
      setErrorMessage(error.message);
      console.error(error);
      // enqueueSnackbar("Unable to create creator!", { variant: "error" });
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack
          sx={{
            width: { xs: "90vw", sm: "70vw", md: 425 },
            display: "flex",
          }}
          p={4}
          spacing={3}
        >
          <Typography variant="h3">Approve Audio Dub</Typography>

          <Stack spacing={1.5}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ mb: 0.5 }}
                htmlFor="video-title-input"
              >
                <Typography variant="labelLarge" color="primary.surface">
                  Title
                </Typography>
              </FormLabel>
              <RHFTextField
                name="title"
                id="video-title-input"
                required
                placeholder="Enter translated title"
                variant="outlined"
                type="text"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "100px",
                    backgroundColor: "#F2F2F2",
                    border: "none",
                    "& .MuiInputBase-input": {
                      typography: "bodyLarge",
                      padding: "16px",
                      "&::placeholder": {
                        color: "common.surfaceVariant",
                        opacity: 0.5,
                      },
                    },
                    "&:hover": {
                      backgroundColor: "common.white",
                      boxShadow: "0 0 16px rgba(38, 38, 38, 0.05)",
                      "& fieldset": {
                        border: (theme) =>
                          `1px solid ${theme.palette.common.mainBorder}`,
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: "common.white",
                      "& fieldset": {
                        border: "1px solid #262626",
                      },
                    },
                    "& fieldset": {
                      border: (theme) =>
                        `1px solid ${theme.palette.common.mainBorder}`,
                    },
                  },
                }}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ mb: 0.5 }}
                htmlFor="description-input"
              >
                <Typography variant="labelLarge" color="primary.surface">
                  Description
                </Typography>
              </FormLabel>
              <RHFTextField
                name="description"
                id="description-input"
                placeholder="Enter translated description"
                variant="outlined"
                type="text"
                fullWidth
                multiline
                minRows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "24px",
                    backgroundColor: "#F2F2F2",
                    border: "none",
                    "& .MuiInputBase-input": {
                      typography: "bodyLarge",
                      resize: "vertical",
                      "&::placeholder": {
                        color: "common.surfaceVariant",
                        opacity: 0.5,
                      },
                    },
                    "&:hover": {
                      backgroundColor: "common.white",
                      boxShadow: "0 0 16px rgba(38, 38, 38, 0.05)",
                      "& fieldset": {
                        border: (theme) =>
                          `1px solid ${theme.palette.common.mainBorder}`,
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: "common.white",
                      "& fieldset": {
                        border: "1px solid #262626",
                      },
                    },
                    "& fieldset": {
                      border: (theme) =>
                        `1px solid ${theme.palette.common.mainBorder}`,
                    },
                  },
                }}
              />
            </FormControl>

            <FormError error={errorMessage} />
          </Stack>

          <Stack spacing={1.25}>
            <LoadingButton
              loading={methods.formState.isSubmitting}
              variant="contained"
              size="large"
              type="submit"
            >
              Confirm
            </LoadingButton>

            <Typography variant="caption" px={0.5} textAlign="center">
              By clicking confirm, you are approving the audio dub.
            </Typography>
          </Stack>
        </Stack>
      </FormProvider>
    </Modal>
  );
}
