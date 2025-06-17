import { Modal } from "@/components/mui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { CreateCreatorDTO, createCreatorDTOSchema, SelectOption } from "hvo-shared";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { RHFCheckbox, RHFMultiSelect, RHFTextField } from "@/components/hook-form";
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

type Props = {
  open: boolean;
  onClose: () => void;
};

type ChannelInput = {
  name: string;
  link: string;
};

// Default form values
const formDefaultValues: CreateCreatorDTO = {
  full_name: "",
  email: "",
  username: "",
  language_ids: [],
  multiple_speakers: false,
  description: "",
  channels: [{ name: "", link: "" }],
};

export default function AddCreatorModal({ open, onClose }: Props) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { languages } = useGetAllLanguages();
  const languageOptions = useMemo(
    () =>
      languages?.map(
        (language) =>
          ({
            id: language.id,
            label: language.name,
            icon: <FlagEmoji countryCode={language.code} size={15} />,
          } as SelectOption)
      ) || [],
    [languages]
  );

  const methods = useForm<CreateCreatorDTO>({
    resolver: zodResolver(createCreatorDTOSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, errors, dirtyFields },
    reset,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "channels",
  });

  const handleAddChannel = () => {
    append({ name: "", link: "" });
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleModalClose = () => {
    reset(formDefaultValues);
    setCurrentStep(1);
    setErrorMessage(undefined);
    onClose();
  };

  const onSubmit = handleSubmit(async (data: CreateCreatorDTO) => {
    setIsSubmitting(true);
    try {
      await createCreator(data);
      enqueueSnackbar("Creator added successfully!", { variant: "success" });
      handleModalClose();
    } catch (error) {
      console.log("err>", error);
      setErrorMessage(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  });

  console.log({
    fullName: methods.getValues("full_name"),
    email: methods.getValues("email"),
    username: methods.getValues("username"),
    languageIds: methods.getValues("language_ids"),
  });

  return (
    <Modal open={open} onClose={handleModalClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack
          sx={{
            width: { xs: "90vw", sm: "70vw", md: 425 },
            display: "flex",
          }}
          p={4}
          spacing={3}
        >
          {currentStep === 1 ? (
            <>
              <Typography variant="h3" alignSelf="center">
                Add Creator
              </Typography>

              <Stack spacing={1.5}>
                <RHFTextField
                  name="full_name"
                  label="Full Name"
                  required
                  placeholder="John Doe"
                  variant="outlined"
                  type="text"
                  fullWidth
                />
                <RHFTextField
                  name="email"
                  label="Email"
                  required
                  placeholder="john.doe@gmail.com"
                  variant="outlined"
                  type="text"
                  fullWidth
                />
                <RHFTextField
                  name="username"
                  label="Username"
                  required
                  placeholder="@johnbeast"
                  variant="outlined"
                  type="text"
                  fullWidth
                />
                <RHFMultiSelect
                  name="language_ids"
                  label="Languages"
                  required
                  options={languageOptions}
                  variant="outlined"
                  useIconAdornment
                  maxHeight={300}
                  fullWidth
                />
                <RHFCheckbox name="multiple_speakers" label="Multiple Speakers" />

                <FormError error={errorMessage} />
              </Stack>

              <Button
                variant="contained"
                size="large"
                onClick={handleNextStep}
                disabled={
                  !dirtyFields.full_name ||
                  !dirtyFields.email ||
                  !dirtyFields.username ||
                  !dirtyFields.language_ids ||
                  !!errors.full_name ||
                  !!errors.email ||
                  !!errors.username ||
                  !!errors.language_ids
                }
              >
                Next
              </Button>
            </>
          ) : (
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5" fontWeight={600} sx={{ opacity: 0.5 }}>
                  {methods.getValues("full_name")}
                </Typography>
                <Typography variant="h5" fontWeight={600} sx={{ opacity: 0.5 }}>
                  /
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  Channels
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ maxHeight: 350, overflow: "auto", pr: 2 }}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{ position: "relative", border: "1px solid #E6E6E6", borderRadius: 1, p: 1.5 }}
                  >
                    <Stack spacing={1.5}>
                      <RHFTextField
                        name={`channels.${index}.name`}
                        label="Channel Name"
                        required
                        placeholder="TheCoolChannel"
                        variant="outlined"
                        type="text"
                        fullWidth
                      />
                      <RHFTextField
                        name={`channels.${index}.link`}
                        label="Channel link"
                        required
                        placeholder="youtube.com/channelx"
                        variant="outlined"
                        type="text"
                        fullWidth
                      />
                    </Stack>
                    {index > 0 && (
                      <IconButton
                        onClick={() => remove(index)}
                        sx={{
                          position: "absolute",
                          top: -14,
                          right: -14,
                          color: "error.main",
                          border: "1px solid #FFCCCC",
                          height: 28,
                          width: 28,
                          p: 0.5,
                        }}
                      >
                        <SvgColor src="/assets/icons/bin.svg" sx={{ width: 24, height: 24, color: "#B20000" }} />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleAddChannel}
                  fullWidth
                >
                  Add Channel
                </Button>

                <FormError error={errorMessage} />
              </Stack>

              <Divider sx={{ mx: -4 }} />

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  onClick={onSubmit}
                  disabled={isSubmitting || (currentStep === 1 && !isValid)}
                >
                  {isSubmitting ? "Adding..." : "Confirm"}
                </Button>

                {/* <Button variant="outlined" onClick={handlePrevStep}>
                  Back
                </Button> */}

                <Typography variant="caption" px={0.5} textAlign="center">
                  By confirming, the creator will receive credentials with which they and their team-members could log
                  in to the hvo platform
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </FormProvider>
    </Modal>
  );
}
