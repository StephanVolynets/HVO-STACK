import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Tooltip,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  SubmitFeedbackDTO,
  submitFeedbackDTOSchema,
  SelectOption,
} from "hvo-shared";
import { useFieldArray, useForm } from "react-hook-form";
import { RHFSelect, RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/form-provider";
import { useSnackbar } from "notistack";
import { useGetVideoPreview } from "@/use-queries/video";
import { useMemo, useState } from "react";
import { FlagEmoji } from "@/components/flag-emoji";
import Iconify from "@/components/iconify";
import { submitFeedback } from "@/apis/feedback";
import { useGetVideoFeedbacks } from "@/use-queries/feedback";
import { LoadingButton } from "@mui/lab";

type Props = {
  open: boolean;
  onClose: () => void;
};

const getDefaultValues = (): SubmitFeedbackDTO => ({
  videoId: 0,
  languageId: 0,
  issues: [
    {
      startTimestamp: 0,
      endTimestamp: 0,
      description: "",
    },
  ],
});

export default function GiveFeedbackModal({ open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { refetch } = useGetVideoFeedbacks();
  const { video } = useGetVideoPreview();
  const [activeTab, setActiveTab] = useState(0);

  const languageOptions = useMemo(
    () =>
      video?.audioDubs
        .map((audioDub) => audioDub.language)
        ?.map(
          (language) =>
            ({
              id: language.id,
              label: language.name,
              icon: <FlagEmoji countryCode={language.code} maxHeight={24} />,
            } as SelectOption)
        ) || [],
    [video?.audioDubs]
  );

  const methods = useForm<SubmitFeedbackDTO>({
    resolver: zodResolver(submitFeedbackDTOSchema),
    defaultValues: getDefaultValues(),
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "issues",
  });

  const handleAddIssue = () => {
    append({
      startTimestamp: 0,
      endTimestamp: 0,
      description: "",
    });
    setActiveTab(fields.length); // Switch to new tab
  };

  const onSubmit = handleSubmit(async (data: SubmitFeedbackDTO) => {
    try {
      data.videoId = video!.id;
      await submitFeedback(data);

      enqueueSnackbar("Feedback submitted successfully!", {
        variant: "success",
      });
      methods.reset(getDefaultValues());
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to submit feedback!", { variant: "error" });
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack
          sx={{
            width: { xs: "90vw", sm: "70vw", md: 450 },
            display: "flex",
          }}
          p={4}
          spacing={3}
        >
          <Typography variant="h3" alignSelf="start">
            Feedback
          </Typography>

          <Stack spacing={1.5}>
            <FormControl component="fieldset">
              <FormLabel component="legend" required sx={{ mb: 0.5 }}>
                <Typography variant="labelLarge" color="primary.surface">
                  Language
                </Typography>
              </FormLabel>
              <RHFSelect
                name="languageId"
                required
                placeholder="Choose a language"
                options={languageOptions}
                variant="outlined"
                useIconAdornment
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "100px",
                    // backgroundColor: "#F2F2F2",
                    // border: "none",
                  },
                }}
              />
            </FormControl>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Stack direction="row" alignItems="center">
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{ flex: 1 }}
                >
                  {fields.map((_, index) => (
                    <Tab
                      key={index}
                      label={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <span>{`No ${index + 1}`}</span>
                          {fields.length > 1 && (
                            <Tooltip title="Remove issue">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeTab === index) {
                                    setActiveTab(Math.max(0, index - 1));
                                  } else if (activeTab > index) {
                                    setActiveTab(activeTab - 1);
                                  }
                                  remove(index);
                                }}
                                sx={{
                                  "&:hover": {
                                    color: "error.main",
                                    backgroundColor: "error.lighter",
                                  },
                                }}
                              >
                                <Iconify
                                  icon="material-symbols:close"
                                  width={18}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      }
                    />
                  ))}
                </Tabs>
                <IconButton onClick={handleAddIssue} sx={{ ml: 1 }}>
                  <Iconify icon="material-symbols:add" />
                </IconButton>
              </Stack>
            </Box>

            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{ display: activeTab === index ? "block" : "none" }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={2}>
                    <FormControl component="fieldset" sx={{ flex: 1 }}>
                      <FormLabel component="legend" required sx={{ mb: 0.5 }}>
                        <Typography
                          variant="labelLarge"
                          color="primary.surface"
                        >
                          Start Time
                        </Typography>
                      </FormLabel>
                      <RHFTextField
                        name={`issues.${index}.startTimestamp`}
                        required
                        placeholder="0"
                        variant="outlined"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="bxs:time-five" color="#929292" />
                            </InputAdornment>
                          ),
                        }}
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
                    <FormControl component="fieldset" sx={{ flex: 1 }}>
                      <FormLabel component="legend" required sx={{ mb: 0.5 }}>
                        <Typography
                          variant="labelLarge"
                          color="primary.surface"
                        >
                          End Time
                        </Typography>
                      </FormLabel>
                      <RHFTextField
                        name={`issues.${index}.endTimestamp`}
                        required
                        placeholder="0"
                        variant="outlined"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="bxs:time-five" color="#929292" />
                            </InputAdornment>
                          ),
                        }}
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
                  </Stack>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ mb: 0.5 }}>
                      <Typography variant="labelLarge" color="primary.surface">
                        Description
                      </Typography>
                    </FormLabel>
                    <RHFTextField
                      name={`issues.${index}.description`}
                      placeholder="Description of the issue goes here"
                      variant="outlined"
                      type="text"
                      fullWidth
                      multiline
                      minRows={4}
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
                </Stack>
              </Box>
            ))}
          </Stack>

          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            size="large"
            type="submit"
            startIcon={<Iconify icon="material-symbols:send" />}
          >
            Send Feedback
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Modal>
  );
}
