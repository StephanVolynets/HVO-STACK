import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormLabel,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddVideoDTO,
  addVideoDTOSchema,
  CreateCreatorDTO,
  createCreatorDTOSchema,
  InitiateVideoUploadInputDTO,
  // InitializeVideoUploadInputDTO,
  // InitializeVideoUploadOutputDTO,
} from "hvo-shared";
import { FieldErrors, useForm } from "react-hook-form";
import { RHFRadioGroup, RHFSelect, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import { scroller } from "react-scroll";
import Iconify from "@/components/iconify";
import { createCreator } from "@/apis/creator";
import { useSnackbar } from "notistack";
import { addVideo, initiateVideoUpload } from "@/apis/video";
import { useAuthContext } from "@/auth/hooks";
import { UploadSingleFile } from "@/components/upload/single-file";
import { useEffect, useState, useCallback } from "react";
import { UploadSingleFileGCS } from "@/components/upload/single-file-GCS";
import MixedInput from "./components/mixed-file-upload";
import { formDefaultValues } from "../form-helpers";

import { useGetYoutubeChannels } from "@/use-queries/video";
import RHFDateTimePicker from "@/components/hook-form/rhf-datetime-picker";
import SvgColor from "@/components/svg-color";
import ChannelSelector from "./components/channel-selector";

//-----------
// VideoUploadForm.tsx
// VideoUploadForm.tsx

type Props = {
  handleRemoveForm: () => void;
  handleAddForm: () => void;
  // showRemoveButton?: boolean;
  formId: string;
  videoIndex: number;
  onSubmitReady: (formId: string, isValid: boolean, data: AddVideoDTO) => void;
  canRemove?: boolean;
};

export default function VideoUploadForm({
  // showRemoveButton,
  handleRemoveForm,
  handleAddForm,
  formId,
  videoIndex,
  onSubmitReady,
  canRemove = true,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [signedUrls, setSignedUrls] = useState<{
    video: string;
    meAudio: string;
  } | null>(null);

  const methods = useForm<AddVideoDTO>({
    resolver: zodResolver(addVideoDTOSchema),
    defaultValues: formDefaultValues,
    mode: "onChange", // Enable real-time validation
  });

  const { control, reset, setValue, formState, watch } = methods;
  const { isValid, errors } = formState;

  const { channels } = useGetYoutubeChannels();

  // Watch all form fields
  // const formValues = watch();

  // // Notify parent when form becomes valid with its data
  // useEffect(() => {
  //   // Check if we have all required fields
  //   const hasRequiredFields =
  //     formValues.title && formValues.video_file_id && formValues.soundtrack_file_id && formValues.session_id;

  //   if (hasRequiredFields && isValid) {
  //     onSubmitReady(formId, true, formValues);
  //   } else {
  //     onSubmitReady(formId, false, formValues);
  //   }
  // }, [formValues]);

  const title = watch("title");
  const videoFileId = watch("video_file_id");
  const soundtrackFileId = watch("soundtrack_file_id");
  const sessionId = watch("session_id");

  // Check form completion status when relevant fields change
  useEffect(() => {
    const hasRequiredFields = title && videoFileId && sessionId;

    if (hasRequiredFields) {
      const currentFormData = methods.getValues();
      onSubmitReady(formId, true, currentFormData);
    }
  }, [
    title,
    videoFileId,
    soundtrackFileId,
    sessionId,
    isValid,
    formId,
    methods,
  ]);

  // Fetch upload URLs
  useEffect(() => {
    const fetchUploadUrls = async () => {
      const creatorId = user?.email;

      try {
        const inputData: InitiateVideoUploadInputDTO = {
          creatorId: creatorId,
        };

        const {
          sessionId,
          uploadUrls: { video, meAudio },
        } = await initiateVideoUpload(inputData);
        setSignedUrls({ video, meAudio });
        setValue("session_id", sessionId);
      } catch (error) {
        console.error("Failed to get upload URLs:", error);
        enqueueSnackbar("Failed to initialize upload URLs.", {
          variant: "error",
        });
      }
    };

    fetchUploadUrls();
  }, []);

  return (
    <Paper
      sx={{
        maxHeight: "80vh",
        minWidth: "485px",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        borderRadius: "24px",
        backgroundColor: "white.main",
        boxShadow: "none",
        border: "1px solid #E6E6E6",
        transition: "transform 0.2s ease-in-out",
        transform: "scale(1)",
        "&:hover": {
          transform: "scale(1.013)",
          "& .remove-button": {
            opacity: 1,
          },
        },
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      <Box
        minHeight={0}
        overflow="auto"
        position="relative"
        maxHeight="100vh"
        sx={{
          borderRadius: "24px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        {canRemove && (
          <IconButton
            id="closeButton"
            aria-label="Close"
            className="remove-button"
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 1,
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
              border: "1px solid #FFCCCC",
              "&:hover": {
                backgroundColor: "rgba(178, 0, 0, 0.05)",
              },
              "&:active": {
                backgroundColor: "rgba(178, 0, 0, 0.1)",
              },
            }}
            onClick={handleRemoveForm}
            size="small"
          >
            <SvgColor src="/assets/icons/bin-outlined.svg" color="#4D0000" />
          </IconButton>
        )}

        <FormProvider methods={methods}>
          <Stack
            sx={{
              width: { xs: "90vw", sm: `calc(440px + 40px)` },
              display: "flex",
              boxSizing: "border-box",
            }}
            p={2.5}
            spacing={1}
          >
            <Stack>
              <Typography variant="h3" color="common.black">
                Video {videoIndex + 1}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <FormControl component="fieldset">
                <FormLabel component="legend" required sx={{ mb: 0.5 }}>
                  <Typography variant="labelLarge" color="primary.surface">
                    Video Type
                  </Typography>
                </FormLabel>
                <RHFRadioGroup
                  name="form_type"
                  options={[
                    { value: "LONG", label: "Longform" },
                    { value: "SHORT", label: "Short" },
                  ]}
                  row
                  sx={{
                    "& .MuiFormControlLabel-root": {
                      flex: 1,
                      // margin: 0,
                      justifyContent: "flex-start",
                    },
                    "& .MuiFormControlLabel-label": {
                      typography: "labelLarge",
                    },
                  }}
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  required
                  sx={{ mb: 0.5 }}
                  htmlFor="youtube-channel-select"
                >
                  <Typography variant="labelLarge" color="primary.surface">
                    Channel
                  </Typography>
                </FormLabel>
                <ChannelSelector />

                {/* <RHFSelect
                  name="youtubeChannelId"
                  required
                  variant="filled"
                  id="youtube-channel-select"
                  options={
                    channels?.map((channel) => ({
                      id: channel.id,
                      label: channel.title,
                      // You can add an icon property if needed
                      // icon: <Box component="img" src="/assets/icons/bin.svg" alt="" sx={{ width: 20, height: 20 }} />,
                    })) || []
                  }
                  useIconAdornment
                /> */}
              </FormControl>
              {/* Release Date & Time */}
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  required
                  sx={{ mb: 0.5 }}
                  htmlFor="expected-by-datetime-picker"
                >
                  <Typography variant="labelLarge" color="primary.surface">
                    Release Date & Time
                  </Typography>
                </FormLabel>
                <RHFDateTimePicker
                  name="expected_by"
                  label="Release Date & Time"
                  required
                  format="MM/dd/yyyy • hh:mm:ss a"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  required
                  sx={{ mb: 0.5 }}
                  htmlFor="video-title-input"
                >
                  <Typography variant="labelLarge" color="primary.surface">
                    Video Title
                  </Typography>
                </FormLabel>
                <RHFTextField
                  name="title"
                  id="video-title-input"
                  required
                  placeholder="I Stayed in “OMG!” Airbnbs"
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
                  // label="Description"
                  placeholder="OMG! sign up to get notified when JOYRIDE is back in stock: https://www.joyridesweets.com/"
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
                        // padding: "16px",
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
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ mb: 0.5 }}
                  htmlFor="video-file-input"
                  required
                >
                  <Typography variant="labelLarge" color="primary.surface">
                    Video File
                  </Typography>
                </FormLabel>
                <MixedInput
                  name="video_file_id"
                  // id="video-file-input"
                  label="Upload Video"
                  type="video"
                  signedUrl={signedUrls?.video}
                  onUploadChange={(fileId) => setValue("video_file_id", fileId)}
                  formErrorMessage={
                    methods.formState.errors.video_file_id?.message
                  }
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ mb: 0.5 }}
                  htmlFor="soundtrack-file-input"
                >
                  <Typography variant="labelLarge" color="primary.surface">
                    Soundtrack File
                  </Typography>
                </FormLabel>
                <MixedInput
                  name="soundtrack_file_id"
                  // id="soundtrack-file-input"
                  label="Upload M&E Soundtrack"
                  type="audio"
                  signedUrl={signedUrls?.meAudio}
                  onUploadChange={(fileId) =>
                    setValue("soundtrack_file_id", fileId)
                  }
                  formErrorMessage={
                    methods.formState.errors.soundtrack_file_id?.message
                  }
                />
              </FormControl>
            </Stack>
          </Stack>
        </FormProvider>
      </Box>
    </Paper>
  );
}
